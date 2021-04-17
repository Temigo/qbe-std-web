import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Container, Header, Icon, Grid, Form, TextArea, List, Segment, Button, Table } from 'semantic-ui-react'
import React, { useRef, useEffect, Component, useState } from "react";

function Edit(props) {
    console.log('Edit', props)
    const [files, setFiles] = useState(props.files)
    const router = useRouter()

    return (
        <div>
            <Header as='h1'>Edit queries and labels</Header>

            <Table celled striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>
                            ID
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
                    {(files !== undefined) && files.map((file) => (
                        <Table.Row key={file.id}>
                            <Table.Cell>{file.id}</Table.Cell>
                            <Table.Cell/>
                            <Table.Cell>{file.name}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>

            </Table>
            <Button circular color='green' floated='right' onClick={() => { setFiles([...files, {id: Date.now(), name: ''} ]); } }>
                <Icon name='add' />
                Add row
            </Button>
            <div style={{clear: 'both'}}/>
            <p>Once you have checked the query labels and associations, you can submit your search job.</p>

            <Button size='huge' primary onClick={/* send request to API */ () => router.push('/status/123') }>
                Submit
            </Button>
        </div>
    );
}

export default Edit
