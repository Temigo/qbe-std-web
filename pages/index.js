import Head from 'next/head'
import styles from '../styles/Home.module.css'
//import WaveSurfer from "wavesurfer.js"
import React, { useRef, useEffect } from "react";

//import dynamic from "next/dynamic";
//const WaveSurfer = dynamic(() => import("wavesurfer.js"), { ssr: false });
//wavesurfer.js/dist/plugin/wavesurfer.regions.min.js
//const waveformRef = useRef(null);

export default function Home() {
    const waveformRef = useRef();
    const timelineRef = useRef();
    const closeRef = useRef();

    useEffect(async () => {
      const WaveSurfer = (await import('wavesurfer.js')).default
      const RegionPlugin = (await import('wavesurfer.js/dist/plugin/wavesurfer.regions.min.js')).default
      //const ElanPlugin = (await import('wavesurfer.js/dist/plugin/wavesurfer.elan.min.js')).default
      //const ElanWaveSegmentPlugin = (await import('wavesurfer.js/dist/plugin/wavesurfer.elan-wave-segment.min.js')).default
      const MarkersPlugin = (await import('wavesurfer.js/dist/plugin/wavesurfer.markers.min.js')).default
      const TimelinePlugin = (await import('wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js')).default

      if(waveformRef.current) {
          console.log(WaveSurfer)
          console.log(RegionPlugin)
        const wavesurfer = WaveSurfer.create({
          container: waveformRef.current,
          barWidth: 2,
          barHeight: 1,
          barRadius: 2,
          barGap: null,
          waveColor: 'violet',
          progressColor: 'purple',
          mediaControls: true,
          backend: 'MediaElement',
          fillParent: true,
          plugins: [
              RegionPlugin.create({}),
              MarkersPlugin.create({
                  markers: [
                      {
                          time: 5.5,
                          label: "V1",
                          color: '#ff990a'
                      }
                  ]
              }),
              TimelinePlugin.create({
                  container: timelineRef.current
              })
              //ElanPlugin.create({}),
              //ElanWaveSegmentPlugin.create({})
          ]
        });

        wavesurfer.load('/test.mp3');
        console.log(wavesurfer)

        wavesurfer.on('region-created', (e) => {
            var el = document.createElement('span');
            el.innerHTML += 'x';
            el.className = "closeButton";
            el.onclick = () => e.remove();

            var label = document.createElement('span');
            label.innerHTML += 'LABEL';
            label.className = 'regionLabel';

            e.element.appendChild(label);
            e.element.appendChild(el);
        })

        wavesurfer.addRegion({
            id: 'test',
            start: 10,
            end: 20,
            loop: false,
            drag: true,
            resize: true,
            color: "rgba(255, 215, 0, 0.2)"
        });

        wavesurfer.addRegion({
            id: 'test',
            start: 30,
            end: 40,
            loop: false,
            drag: true,
            resize: true,
            color: "rgba(255, 215, 0, 0.2)"
        });
        //wavesurfer.enableDragSelection();

        //waveformRef.current.addEventListener("region-mouseenter", (e) => console.log('hi', e))
        //wavesurfer.on('region-mouseenter', (e) => console.log('hi', e))
        return () => wavesurfer.destroy();
      }
    }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>QBE-STD</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to QBE-STD!
        </h1>

        <div ref={waveformRef} style={{width: '100%', paddingTop: "1em"}}>
            <div ref={timelineRef} style={{width: '100%'}}/>
        </div>

      </main>

      <footer className={styles.footer}>
        Footer
      </footer>
    </div>
  )
}
