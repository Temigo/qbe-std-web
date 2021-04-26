import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Container, Header, Icon, Grid, Form, TextArea, List, Segment, Button, Table, Input } from 'semantic-ui-react'
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
        if (wavesurfer !== undefined && json !== undefined) {
            wavesurfer.clearRegions();
            json.map((region, regionIdx) => {
                wavesurfer.addRegion({
                    id: regionIdx,
                    start: region.start,
                    end: region.end,
                    loop: false,
                    drag: false,
                    resize: true,
                    color: "rgba(255, 215, 0, 0.2)",
                    attributes: {
                        label: region.label,
                        new: false
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

    //const [ annotatedRegions, setAnnotatedRegions ] = useState(defaultAnnotatedRegions);
    console.log('Audio', props.annotatedRegions)
    useEffect(() => {
    async function factory () {
      const WaveSurfer = (await import('wavesurfer.js')).default
      const RegionPlugin = (await import('wavesurfer.js/dist/plugin/wavesurfer.regions.min.js')).default
      const MarkersPlugin = (await import('wavesurfer.js/dist/plugin/wavesurfer.markers.min.js')).default
      const TimelinePlugin = (await import('wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js')).default
      const CursorPlugin = (await import('wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js')).default

      if(waveformRef.current) {
        console.log(waveform.current, waveform.current instanceof WaveSurfer)
        if (waveform.current instanceof WaveSurfer) {
            console.log('destroying')
            waveform.current.destroy()
        }
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
                      // {
                      //     time: 5.5,
                      //     label: "V1",
                      //     color: '#ff990a'
                      // }
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
        let reader = new FileReader()
        reader.onload = (x) => ws.load(x.target.result)
        reader.readAsDataURL(props.file)
        //ws.load('/test.mp3');

        ws.enableDragSelection({
            minLength: 1,
            loop: false,
            drag: false,
            resize: true,
            attributes: {new: true}
        })
        ws.on('region-created', (e) => {
            var el = document.createElement('span');
            el.innerHTML += 'x';
            el.className = "closeButton";
            el.onclick = (event) => {event.stopPropagation(); e.remove(); };

            var edit_label = document.createElement('input');
            //edit_label.style = {visibility: "hidden"};
            edit_label.type = "hidden";
            edit_label.value = e.attributes.label;
            edit_label.className = 'regionLabel inputLabel'
            edit_label.style.width = (edit_label.value.length + 5) + 'ch'
            edit_label.onclick = (event) => {
                event.stopPropagation();
            }
            edit_label.onkeypress = (event) => {
                edit_label.style.width = (edit_label.value.length + 5) + 'ch'
            }

            var label = document.createElement('span');
            label.innerHTML += e.attributes.label;
            label.className = 'regionLabel';
            label.onclick = (event) => {
                event.stopPropagation();
                console.log('click label', event, label);
                edit_label.type = "text";
                label.style.visibility = "hidden";
                edit_label.focus()
            };

            edit_label.onkeyup = (event) => {
                if (event.key === 'Enter' || event.keyCode == 13) {
                    console.log(edit_label.value)
                    props.updateRegionLabel(e.id, edit_label.value)
                    edit_label.type='hidden';
                    label.style.visibility = 'visible'
                }
            }

            e.element.appendChild(label);
            e.element.appendChild(edit_label);
            e.element.appendChild(el);
        })

        ws.on('region-update-end', (e) => {
            props.updateAnnotatedRegions(e);
        })

        ws.on('region-click', (region, event) => {
            event.stopPropagation();
            region.play();
        });

        // sliderRef.current.oninput = function (event) {
        //     ws.zoom(Number(event.target.value));
        // };

        updateRegions(ws, props.annotatedRegions);
        console.log("factory done", Object.keys(ws.regions.list))
        // return () => {
        //     ws.destroy();
        //     uppy.close();
        // }
        waveform.current = ws;
        return () => ws.destroy();
      }
  };
  factory();
}, [props.file === undefined ? props.file : props.file.name]);

    useEffect(() => {
        if (waveform.current !== undefined) {
            console.log('useEffect, update regions')
            updateRegions(waveform.current, props.annotatedRegions)
        }
    }, [props.annotatedRegions]);

    return (
        <div ref={waveformRef} style={{width: '100%', paddingTop: "1em", position: 'relative'}}>
            <div ref={timelineRef} style={{width: '100%'}}/>
        </div>
    );
}

export default Audio
