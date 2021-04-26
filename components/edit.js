import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Container, Header, Icon, Grid, Form, TextArea, List, Segment, Button, Table, Select } from 'semantic-ui-react'
import React, { useRef, useEffect, Component, useState } from "react";
import Audio from './audio.js'

function Edit(props) {
    console.log('Edit', props.files)
    const [files, setFiles] = useState(props.files)
    const [fileIndex, setFileIndex] = useState(0)

    const router = useRouter()
    const [queries, setQueries] = useState([])
    //console.log(files)
    const [regions, setRegions] = useState(props.files.map((f) => []))
    //console.log('file current', fileIndex, files[fileIndex])
    console.log('region current', regions, fileIndex)
    return (
        <div>
            <Header as='h1'>Edit queries</Header>
            <p>Click & drag to define new queries. Click on a text label to edit it.</p>
            <Form>
                <Form.Field>
                    <label>Query files</label>
                    <Select
                        options={files.map((file) => { return {key: file.id, value: file.id, text: file.name}; } )}
                        value={ files.length > 0 ? files[fileIndex].id : ''}
                        onChange={(event, data) => setFileIndex(files.findIndex((f) => f.id == data.value))}
                    />
                </Form.Field>
            </Form>

            {(files !== undefined) && (files.length > 0) && (
                        <Audio
                            file={files[fileIndex].data}
                            annotatedRegions={regions[fileIndex]}
                            updateAnnotatedRegions={(x) => {
                                console.log('updateAnnotatedRegions', x)
                                if (x.attributes.new) {
                                    console.log('adding')
                                    setRegions(prevRegions =>[...prevRegions.splice(0, fileIndex), prevRegions[fileIndex].concat([{
                                        start: x.start,
                                        end: x.end,
                                        label: "New query",
                                        file_id: 'blabla'
                                    }]), ...prevRegions.splice(fileIndex+1)])
                                }
                                else {
                                    setRegions(prevRegions => [...prevRegions.splice(0, fileIndex), [...prevRegions[fileIndex].slice(0, x.id), { ...prevRegions[fileIndex][x.id], start: x.start, end: x.end }, ...prevRegions[fileIndex].slice(x.id+1)], ...prevRegions.splice(fileIndex+1)]);
                                }
                            }}
                            updateRegionLabel={(id, text) => setRegions(prevRegions => [...prevRegions.slice(0, id), { ...prevRegions[id], label: text }, ...prevRegions.slice(id+1)])}
                        />
            )}

            <Table celled striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>
                            File ID
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            Text label
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            Audio
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                {regions[fileIndex] !== undefined && regions[fileIndex].map((query) => (
                    <Table.Row>
                        <Table.Cell>{query.file_id}</Table.Cell>
                        <Table.Cell>{query.label}</Table.Cell>
                        <Table.Cell>{query.start}-{query.end}</Table.Cell>
                    </Table.Row>
                ))}
                </Table.Body>

            </Table>

            <div style={{clear: 'both'}}/>
            <p>Once you have checked the query labels and associations, you can submit your search job.</p>

            <Button size='huge' primary onClick={/* send request to API */ () => router.push('/status/123') }>
                Submit
            </Button>
        </div>
    );
}

export default Edit
