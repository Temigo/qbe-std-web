import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Container, Header, Icon, Grid, Form, TextArea, List, Segment, Button, Table } from 'semantic-ui-react'
import React, { useRef, useEffect, Component, useState } from "react";

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

function Audio(props) {
    const waveformRef = useRef();
    const timelineRef = useRef();
    const closeRef = useRef();
    const sliderRef = useRef();

    const waveform = useRef(undefined);
    let wavesurfer = waveform.current;

    const [ annotatedRegions, setAnnotatedRegions ] = useState(defaultAnnotatedRegions);

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

        // sliderRef.current.oninput = function (event) {
        //     ws.zoom(Number(event.target.value));
        // };

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

    return (
        <div ref={waveformRef} style={{width: '100%', paddingTop: "1em", position: 'relative'}}>
            <div ref={timelineRef} style={{width: '100%'}}/>
        </div>
    );
}

export default Audio
