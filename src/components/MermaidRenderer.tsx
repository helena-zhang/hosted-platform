import React from 'react';
import Mermaid from 'react-mermaid2';

export function MermaidRenderer({ code }) {
  return <Mermaid chart={code} />;
}
