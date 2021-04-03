import Head from 'next/head'
import styles from '../styles/Home.module.css'
import 'semantic-ui-css/semantic.min.css'
//import WaveSurfer from "wavesurfer.js"
import React, { useRef, useEffect } from "react";

import { Container, Header, Icon } from 'semantic-ui-react'

export default function Home() {
    const waveformRef = useRef();
    const timelineRef = useRef();
    const closeRef = useRef();
    const sliderRef = useRef();

    useEffect(async () => {
      const WaveSurfer = (await import('wavesurfer.js')).default
      const RegionPlugin = (await import('wavesurfer.js/dist/plugin/wavesurfer.regions.min.js')).default
      //const ElanPlugin = (await import('wavesurfer.js/dist/plugin/wavesurfer.elan.min.js')).default
      //const ElanWaveSegmentPlugin = (await import('wavesurfer.js/dist/plugin/wavesurfer.elan-wave-segment.min.js')).default
      const MarkersPlugin = (await import('wavesurfer.js/dist/plugin/wavesurfer.markers.min.js')).default
      const TimelinePlugin = (await import('wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js')).default
      const CursorPlugin = (await import('wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js')).default

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
              }),
              CursorPlugin.create({
                  showTime: true,
                  opacity: 1
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
        wavesurfer.on('region-click', (region, event) => {
            event.stopPropagation();
            console.log(region, event)
            //wavesurfer.seekTo(region.start)
            region.play();
            //wavesurfer.play(region.start, region.end)
            console.log('play')
        });

        sliderRef.current.oninput = function (event) {
            wavesurfer.zoom(Number(event.target.value));
            //console.log('zoom', event.target)
        };

        return () => wavesurfer.destroy();
      }
    }, []);

  return (
    <Container className={styles.container}>
      <Head>
        <title>QBE-STD</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <Header as='h1' textAlign='center'>
          Welcome to QBE-STD!
        </Header>

        <div style={{width: "80%", margin: "auto"}}>
            <Icon name="zoom-in" />
            <input ref={sliderRef} data-action="zoom" type="range" min="20" max="1000" step="100" defaultValue="0" style={{width: "80%", margin: "auto"}}/>
            <Icon name="zoom-out" />
        </div>

        <div ref={waveformRef} style={{width: '100%', paddingTop: "1em", position: 'relative'}}>
            <div ref={timelineRef} style={{width: '100%'}}/>
        </div>



      </main>

      <footer className={styles.footer}>
        Footer
      </footer>

    </Container>
  )
}
