import FaultyTerminal from './components/FaultyTerminal';

export default function AppWithBackground() {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      <FaultyTerminal
        scale={1.5}
        gridMul={[2, 1]}
        digitSize={1.2}
        timeScale={1}
        pause={false}
        scanlineIntensity={1}
        glitchAmount={1}
        flickerAmount={1}
        noiseAmp={1}
        chromaticAberration={0}
        dither={0}
        curvature={0}
        tint="#ffffff"
        mouseReact={true}
        mouseStrength={0.5}
        pageLoadAnimation={false}
        brightness={1}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Place your main App here */}
      </div>
    </div>
  );
}
