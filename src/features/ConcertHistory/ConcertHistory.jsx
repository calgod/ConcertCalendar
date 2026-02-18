import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { Text as VisxText } from '@visx/text';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';
import { Card, Text } from '@mantine/core';
import { useMediaQuery, useElementSize, useViewportSize } from '@mantine/hooks';
import { useSheetEvents } from '../../hooks/useSheetEvents';
import './ConcertHistory.css';

const colors = ['#87CEFA', '#6B8E23', '#FF6F61'];
const WORDCLOUD_FONT = "'Avenir Next', 'Futura', 'Trebuchet MS', sans-serif";

function normalizePhrase(phrase) {
  return phrase.trim().replace(/\s+/g, ' ');
}

function calculatePhraseFrequencies(phrases) {
  const freqMap = {};

  for (const phrase of phrases) {
    const normalized = normalizePhrase(phrase);
    if (!normalized) continue;

    const key = normalized.toLowerCase();
    if (!freqMap[key]) {
      freqMap[key] = { text: normalized, value: 0 };
    }

    freqMap[key].value += 1;
  }

  return Object.values(freqMap).sort(
    (a, b) => b.value - a.value || a.text.localeCompare(b.text),
  );
}

function getFontSize(value, minValue, maxValue, minFont, maxFont) {
  if (minValue === maxValue) {
    return Math.round((minFont + maxFont) / 2);
  }

  const ratio = (value - minValue) / (maxValue - minValue);
  const easedRatio = Math.pow(ratio, 1.6);
  return Math.round(minFont + easedRatio * (maxFont - minFont));
}

function createSeededRandom(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function CloudWordsLayer({ cloudWords, onLayout }) {
  useEffect(() => {
    if (cloudWords.length === 0) return;

    let minY = Infinity;
    let maxY = -Infinity;

    for (const word of cloudWords) {
      const halfHeight = word.size * 0.58;
      minY = Math.min(minY, word.y - halfHeight);
      maxY = Math.max(maxY, word.y + halfHeight);
    }

    onLayout({
      placedCount: cloudWords.length,
      usedHeight: maxY - minY,
      snapshotWords: cloudWords.map(word => ({
        text: word.text,
        x: word.x,
        y: word.y,
        size: word.size,
        color: word.color,
      })),
    });
  }, [cloudWords, onLayout]);

  return cloudWords.map(word => (
    <VisxText
      key={word.text}
      fill={word.color}
      textAnchor='middle'
      transform={`translate(${word.x}, ${word.y})`}
      fontSize={word.size}
      fontFamily={WORDCLOUD_FONT}
      fontWeight={600}
    >
      {word.text}
    </VisxText>
  ));
}

export default function ConcertHistory() {
  const { data: events = [], isLoading, isError, error } = useSheetEvents();
  const isMobile = useMediaQuery('(max-width: 48em)');
  const { ref, width: containerWidth } = useElementSize();
  const { width: viewportWidth } = useViewportSize();

  const phrases = useMemo(() => calculatePhraseFrequencies(events), [events]);

  const minCount = useMemo(() => {
    if (phrases.length === 0) return 0;
    return Math.min(...phrases.map(phrase => phrase.value));
  }, [phrases]);

  const maxCount = useMemo(() => {
    if (phrases.length === 0) return 0;
    return Math.max(...phrases.map(phrase => phrase.value));
  }, [phrases]);

  const measuredWidth = containerWidth || viewportWidth * 0.9;
  const cloudWidth = Math.max(280, Math.min(measuredWidth - 10, 980));

  const minFont = isMobile ? 14 : 16;
  const startingMaxFont = isMobile ? 44 : 62;
  const crowdingPenalty = Math.max(0, (phrases.length - 28) * 0.14);
  const maxFont = Math.max(isMobile ? 32 : 44, startingMaxFont - crowdingPenalty);

  const words = useMemo(() => {
    return phrases.map((phrase, index) => ({
      ...phrase,
      color: colors[index % colors.length],
      size: getFontSize(phrase.value, minCount, maxCount, minFont, maxFont),
    }));
  }, [phrases, minCount, maxCount, minFont, maxFont]);

  const minCloudHeight = isMobile ? 250 : 300;
  const maxCloudHeight = isMobile ? 1100 : 900;

  const initialCloudHeight = useMemo(() => {
    const baseline = isMobile ? 220 : 270;
    const density = phrases.length * (isMobile ? 4.1 : 3.1);
    return Math.round(clamp(baseline + density, minCloudHeight, maxCloudHeight));
  }, [isMobile, phrases.length, minCloudHeight, maxCloudHeight]);

  const [cloudHeight, setCloudHeight] = useState(initialCloudHeight);
  const [isCloudReady, setIsCloudReady] = useState(false);
  const [lockedWords, setLockedWords] = useState([]);
  const [lockedCloudHeight, setLockedCloudHeight] = useState(initialCloudHeight);
  const cloudHeightRef = useRef(initialCloudHeight);
  const isCloudReadyRef = useRef(false);
  const adjustmentPassesRef = useRef(0);
  const stableLayoutsRef = useRef(0);
  const readyTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (readyTimerRef.current) {
        window.clearTimeout(readyTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (readyTimerRef.current) {
      window.clearTimeout(readyTimerRef.current);
    }
    setCloudHeight(initialCloudHeight);
    setLockedCloudHeight(initialCloudHeight);
    setLockedWords([]);
    cloudHeightRef.current = initialCloudHeight;
    isCloudReadyRef.current = false;
    adjustmentPassesRef.current = 0;
    stableLayoutsRef.current = 0;
    setIsCloudReady(false);
  }, [initialCloudHeight, words.length, cloudWidth]);

  const handleLayout = useCallback(
    ({ placedCount, usedHeight, snapshotWords }) => {
      if (isCloudReadyRef.current) {
        return;
      }

      const current = cloudHeightRef.current ?? initialCloudHeight;
      const desiredFitHeight = clamp(
        Math.round(usedHeight + (isMobile ? 34 : 42)),
        minCloudHeight,
        maxCloudHeight,
      );

      let next = current;

      if (placedCount < words.length) {
        next = clamp(
          Math.max(current + (isMobile ? 80 : 60), desiredFitHeight + 36),
          minCloudHeight,
          maxCloudHeight,
        );
      } else {
        const utilization = usedHeight / current;

        if (utilization < 0.68) {
          next = clamp(
            Math.max(desiredFitHeight, Math.round(current * 0.86)),
            minCloudHeight,
            maxCloudHeight,
          );
        } else if (utilization > 0.94) {
          next = clamp(
            Math.max(desiredFitHeight, Math.round(current * 1.08)),
            minCloudHeight,
            maxCloudHeight,
          );
        } else {
          next = desiredFitHeight;
        }
      }

      const closeEnough = Math.abs(next - current) < 20;
      const outOfPasses = adjustmentPassesRef.current >= 6;
      const allPlaced = placedCount === words.length;

      if (closeEnough || outOfPasses) {
        stableLayoutsRef.current += 1;
        if (stableLayoutsRef.current >= 3 && (allPlaced || outOfPasses)) {
          if (readyTimerRef.current) {
            window.clearTimeout(readyTimerRef.current);
          }
          readyTimerRef.current = window.setTimeout(() => {
            if (snapshotWords?.length) {
              setLockedWords(snapshotWords);
              setLockedCloudHeight(cloudHeightRef.current);
            }
            isCloudReadyRef.current = true;
            setIsCloudReady(true);
          }, 220);
        }
        return;
      }

      if (readyTimerRef.current) {
        window.clearTimeout(readyTimerRef.current);
      }
      stableLayoutsRef.current = 0;
      adjustmentPassesRef.current += 1;
      cloudHeightRef.current = next;
      setCloudHeight(next);
    },
    [
      initialCloudHeight,
      isMobile,
      minCloudHeight,
      maxCloudHeight,
      words.length,
    ],
  );

  const random = useMemo(() => {
    const seed = phrases.length * 97 + Math.round(cloudWidth) * 13;
    return createSeededRandom(seed || 1);
  }, [phrases.length, cloudWidth]);

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error: {error.message}</Text>;

  return (
    <div className='wordcloud-container'>
      <Card className='wordcloud-card' withBorder shadow='sm' radius='xl' ref={ref}>
        {phrases.length === 0 ? (
          <Text>No concert history data yet.</Text>
        ) : (
          <>
            {!isCloudReady && (
              <div className='wordcloud-loading'>
                <Text c='dimmed' size='sm'>
                  Arranging cloud...
                </Text>
              </div>
            )}
            {isCloudReady && lockedWords.length > 0 ? (
              <div className='wordcloud-stage wordcloud-stage-visible'>
                <svg width={cloudWidth} height={lockedCloudHeight}>
                  <g transform={`translate(${cloudWidth / 2}, ${lockedCloudHeight / 2})`}>
                    {lockedWords.map(word => (
                      <VisxText
                        key={word.text}
                        fill={word.color}
                        textAnchor='middle'
                        transform={`translate(${word.x}, ${word.y})`}
                        fontSize={word.size}
                        fontFamily={WORDCLOUD_FONT}
                        fontWeight={600}
                      >
                        {word.text}
                      </VisxText>
                    ))}
                  </g>
                </svg>
              </div>
            ) : (
              <div className='wordcloud-stage wordcloud-stage-hidden'>
                <Wordcloud
                  words={words}
                  width={cloudWidth}
                  height={cloudHeight}
                  fontSize={datum => datum.size}
                  font={WORDCLOUD_FONT}
                  padding={Math.max(3, Math.round(cloudWidth / 190))}
                  spiral='rectangular'
                  rotate={0}
                  random={random}
                >
                  {cloudWords => (
                    <CloudWordsLayer cloudWords={cloudWords} onLayout={handleLayout} />
                  )}
                </Wordcloud>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
