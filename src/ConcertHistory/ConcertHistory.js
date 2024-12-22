import React, { useState, useEffect, useRef } from "react";
import { Text } from "@visx/text";
import Wordcloud from "@visx/wordcloud/lib/Wordcloud";
import { scaleLog } from "@visx/scale";
import { fetchCalendarEvents } from "../API/api";
import { Card } from "@mantine/core";

const colors = ["#87CEFA", "#6B8E23", "#FF6F61"];

function calculatePhraseFrequencies(phrases) {
  const freqMap = {};

  for (const phrase of phrases) {
    const cleanedPhrase = phrase.trim().toLowerCase();
    if (!cleanedPhrase) continue;
    freqMap[cleanedPhrase] = (freqMap[cleanedPhrase] || 0) + 1;
  }

  return Object.keys(freqMap).map((phrase) => ({
    text: phrase,
    value: freqMap[phrase],
  }));
}

export default function ConcertHistory() {
  const [events, setEvents] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 1500, height: 1000 });
  const containerRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchCalendarEvents();
      const previousEvents = data.sheetData.values; 
      setEvents(previousEvents.flat());
    }

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const maxHeight = 500;
      const maxWidth = 1000;
      
      setDimensions({
        width: Math.min(windowWidth * 0.9, maxWidth), 
        height: Math.min(windowHeight * 0.9, maxHeight)
      });
    };
  
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const phrases = calculatePhraseFrequencies(events);

  const fontScale = scaleLog({
    domain: [
      Math.min(...phrases.map((p) => p.value)) || 1,
      Math.max(...phrases.map((p) => p.value)) || 10,
    ],
    range: [8, Math.min(dimensions.width, dimensions.height) * 0.1],
  });

  const fontSizeSetter = (datum) => {
    const size = fontScale(datum.value);
    return Math.min(size, 100);
  };

  const fixedValueGenerator = () => 0.5;

  return (
    <div
      ref={containerRef} 
      className="wordcloud-container w-full"
      style={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        margin: 0,
        padding: 0
      }}
    >
      <Card
        style={{
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
      {phrases.length > 0 && (
        <Wordcloud
          words={phrases}
          width={dimensions.width}
          height={dimensions.height}
          fontSize={fontSizeSetter}
          font={"Roboto"}
          padding={3}
          spiral="rectangular"
          rotate={0}
          random={fixedValueGenerator}
        >
          {(cloudWords) =>
            cloudWords.map((w, i) => (
              <Text
                key={w.text}
                fill={colors[i % colors.length]}
                textAnchor={"middle"}
                transform={`translate(${w.x}, ${w.y})`}
                fontSize={w.size}
                fontFamily={w.font}
              >
                {w.text}
              </Text>
            ))
          }
        </Wordcloud>
      )}
      </Card>
    </div>
  );
}