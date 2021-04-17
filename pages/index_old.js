import Head from 'next/head'

import styles from '../styles/Home.module.css'
import 'semantic-ui-css/semantic.min.css'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
//import '@uppy/drag-drop/dist/style.css'
// import WaveSurfer from 'wavesurfer.js'
// import RegionPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js'
// import MarkersPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.markers.min.js'
// import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js'
// import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js'

//import WaveSurfer from "wavesurfer.js"
import React, { useRef, useEffect, Component, useState } from "react";

import { Container, Header, Icon, Grid, Form, TextArea, List } from 'semantic-ui-react'

import Uppy from '@uppy/core'
import GoogleDrive from '@uppy/google-drive'
//import DashboardModule from '@uppy/dashboard'
import Url from '@uppy/url'
import { Dashboard, StatusBar, useUppy } from '@uppy/react'
import XHRUpload from '@uppy/xhr-upload'

// const uppy = new Uppy({
//   meta: { type: 'avatar' },
//   restrictions: { maxNumberOfFiles: 1 },
//   autoProceed: true
// })
//uppy.use(GoogleDrive, { endpoint: '/upload'})
// uppy.use(Dashboard, {
//     id: 'Dashboard',
//     height: 200
// });

// uppy.on('complete', (result) => {
//   const url = result.successful[0].uploadURL
//   console.log(url)
// })

function useWaveform (factory) {
  if (typeof factory !== 'function') {
    throw new TypeError('useWaveform: expected a function that returns a new Uppy instance')
  }

  const waveform = useRef(undefined)
  if (waveform.current === undefined) {
      console.log('running factory')
    waveform.current = factory()
  }

  useEffect(() => {
    return () => {
      waveform.destroy()
    }
  }, [])

  return waveform.current
}

const defaultAnnotatedRegions = {
    regions: [{
        start: 10,
        end: 20,
        label: "Example"
    }]
};

let updateRegions = (wavesurfer, json) => {
    //Promise.resolve(wavesurfer).then((wavesurfer) => {
        if (wavesurfer !== undefined) {
            wavesurfer.clearRegions();
            json.regions.map((region, regionIdx) => {
                wavesurfer.addRegion({
                    id: regionIdx,
                    start: region.start,
                    end: region.end,
                    loop: false,
                    drag: false,
                    resize: true,
                    color: "rgba(255, 215, 0, 0.2)",
                    attributes: {
                        label: region.label
                    }
                });
            });
        }
    //});
};

export default function Home()  {
    const uppy = useUppy(() => {
        return new Uppy({
            autoProceed: true
        }).use(XHRUpload, {id: 'XHRUpload', endpoint: 'https://api2.transloadit.com'});
    });
    uppy.on('upload-success', (file, response) => console.log(file, response));
    uppy.on('upload-error', (file, error, response) => console.log(error))
    uppy.on('upload', (data) => console.log(data))
    console.log(uppy.getFiles());

    const waveformRef = useRef();
    const timelineRef = useRef();
    const closeRef = useRef();
    const sliderRef = useRef();

    const waveform = useRef(undefined);
    let wavesurfer = waveform.current;

    const [ annotatedRegions, setAnnotatedRegions ] = useState(defaultAnnotatedRegions);
    const [ textarea, setTextarea ] = useState(JSON.stringify(defaultAnnotatedRegions, undefined, 4));
    //var [wavesurfer, setWavesurfer] = useState(undefined);

    useEffect(() => {
    async function factory () {
      const WaveSurfer = (await import('wavesurfer.js')).default
      const RegionPlugin = (await import('wavesurfer.js/dist/plugin/wavesurfer.regions.min.js')).default
      const MarkersPlugin = (await import('wavesurfer.js/dist/plugin/wavesurfer.markers.min.js')).default
      const TimelinePlugin = (await import('wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js')).default
      const CursorPlugin = (await import('wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js')).default

      if(waveformRef.current) {
        let ws = WaveSurfer.create({
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
        //setWavesurfer(ws);

        ws.load('/test.mp3');

        ws.on('region-created', (e) => {
            var el = document.createElement('span');
            el.innerHTML += 'x';
            el.className = "closeButton";
            el.onclick = (event) => {event.stopPropagation(); e.remove(); };

            var label = document.createElement('span');
            label.innerHTML += e.attributes.label;
            label.className = 'regionLabel';

            e.element.appendChild(label);
            e.element.appendChild(el);
        })

        ws.on('region-click', (region, event) => {
            event.stopPropagation();
            region.play();
            console.log(uppy.getFiles());
        });

        sliderRef.current.oninput = function (event) {
            ws.zoom(Number(event.target.value));
        };

        updateRegions(ws, annotatedRegions);
        console.log("factory done", Object.keys(ws.regions.list))
        // return () => {
        //     ws.destroy();
        //     uppy.close();
        // }
        waveform.current = ws;
      }
  };
  factory();
  }, []);

  useEffect(() => updateRegions(wavesurfer, annotatedRegions), [annotatedRegions])
  console.log("render", wavesurfer);
  // if (wavesurfer !== undefined) {
  //     console.log(Object.entries(wavesurfer.regions.list))
  // }
  // const [annotations, setAnnotations] = useState(<p>No annotations available.</p>);
  // useEffect(() => {
  //     //Promise.resolve(wavesurfer).then((wavesurfer) => {
  //         console.log('resolved', wavesurfer)
  //         console.log('condition', annotations,  (wavesurfer !== undefined) ? ((wavesurfer.regions === undefined) ? [wavesurfer.regions] : wavesurfer.regions.list.map((r) => r.id)) : [wavesurfer])
  //
  //         if (wavesurfer !== undefined) {
  //             console.log(Object.values(wavesurfer.regions.list).length)
  //             if (Object.values(wavesurfer.regions.list).length > 0) {
  //                 setAnnotations(Object.values(wavesurfer.regions.list).map((region, regionIdx) => {
  //                     return (
  //                         <List.Item key={regionIdx}>
  //                             Hi
  //                         </List.Item>
  //                     );
  //                 }))
  //             }
  //         }
  //     //});
  // }, [annotatedRegions]);
    // Promise.resolve(wavesurfer).then((ws) => {
  //     console.log('resolved', ws)
  //
  // })
  return (
    <Container style={{marginTop: "3em"}}>
      <Head>
        <title>QBE-STD</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <Grid centered columns={2} divided stackable stretched verticalAlign="middle">
            <Grid.Row>
                <Header as='h1' textAlign='center'>
                  Welcome to QBE-STD!
                </Header>
            </Grid.Row>
            <Grid.Row>
                <Dashboard uppy={uppy} plugins={['DragDrop']} height={200} />
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={3}>
                    <Form>
                        <Header as='h3'>Annotated regions JSON:</Header>
                        <TextArea rows={20} onChange={(event, data) => {
                            setTextarea(data.value);
                            // Do not update regions if there is a syntax problem
                            try {
                                var json = JSON.parse(data.value.replace(/\n/g, ''));
                                json.regions = json.regions.filter((region) => region.start < region.end);
                                setAnnotatedRegions(json);
                                console.log('changed annotation', json)
                            } catch (e) {}
                        }} value={textarea} />
                    </Form>
                </Grid.Column>

                <Grid.Column width={3}>
                    <List>
                        {annotatedRegions.regions.map((region, regionIdx) => (
                            <List.Item key={regionIdx}>
                                Hi
                            </List.Item>
                        ))}
                    </List>
                </Grid.Column>

                <Grid.Column width={10}>
                    <div style={{width: "80%", margin: "auto"}}>
                        <Icon name="zoom-in" />
                        <input ref={sliderRef} data-action="zoom" type="range" min="20" max="1000" step="100" defaultValue="0" style={{width: "80%", margin: "auto"}}/>
                        <Icon name="zoom-out" />
                    </div>

                    <div ref={waveformRef} style={{width: '100%', paddingTop: "1em", position: 'relative'}}>
                        <div ref={timelineRef} style={{width: '100%'}}/>
                    </div>
                </Grid.Column>
            </Grid.Row>

        </Grid>
      <footer className={styles.footer}>
        Footer
      </footer>

    </Container>
  )
}
