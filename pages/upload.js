import Head from 'next/head'
import Link from 'next/link'
import { Container, Header, Icon, Grid, Form, TextArea, List, Segment, Button, Transition, Step } from 'semantic-ui-react'
import React, { useRef, useEffect, Component, useState } from "react";
import Edit from '../components/edit.js'

import Uppy from '@uppy/core'
import GoogleDrive from '@uppy/google-drive'
//import DashboardModule from '@uppy/dashboard'
import Url from '@uppy/url'
import { Dashboard, StatusBar, useUppy } from '@uppy/react'
import XHRUpload from '@uppy/xhr-upload'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'

function Upload() {
    const [step, setStep] = useState(1)
    const [collection, setCollection] = useState("")
    const [queryFiles, setQueryFiles] = useState([])
    const [searchFiles, setSearchFiles] = useState([])

    const searchUploader = useUppy(() => {
        return new Uppy({
            id: 'searchUploader',
            autoProceed: true
        }).use(XHRUpload, {id: 'XHRUpload', endpoint: 'https://29e819c1-68b3-4c5e-9b52-39f08345f759.mock.pstmn.io/upload'});
    });
    searchUploader.on('upload-success', (file, response) => {
        console.log(file, response);
        if (response.status === 200) {
            setCollection(response.body.collection_id)
        }
        else {
            console.log('Error while uploading', response)
        }
        if (file.source == 'step1') {
            setStep(step + 1);
        }
    });
    searchUploader.on('upload-error', (file, error, response) => console.log(error, response))
    searchUploader.on('file-added', (file) => {
        searchUploader.setFileMetaData(file.id, {
            collection: collection
        })
    })
    searchUploader.on('complete', (result) => {
        console.log(result)
        if (result.failed.length === 0) {
            setSearchFiles(result.successful)
        }
    })

    const queryUploader = useUppy(() => {
        return new Uppy({
            id: 'queryUploader',
            autoProceed: true
        }).use(XHRUpload, {id: 'XHRUpload', endpoint: 'https://29e819c1-68b3-4c5e-9b52-39f08345f759.mock.pstmn.io/upload'});
    });
    // queryUploader.on('upload-success', (file, response) => {
    //     console.log(file, response);
    //     if (response.status === 200) {
    //
    //     }
    //     else {
    //         console.log('Error while uploading', response)
    //     }
    //     if (file.source == 'step2') {
    //         setStep(step + 1);
    //     }
    // });
    queryUploader.on('file-added', (file) => {
        searchUploader.setFileMetaData(file.id, {
            collection: collection
        })
    })
    queryUploader.on('complete', (result) => {
        console.log(result)
        if (result.failed.length === 0) {
            setStep(step + 1)
            setQueryFiles(result.successful)
        }
    })

    return (
        <Grid style={{ height: '100vh' }} verticalAlign='middle' centered>
            <Head>
              <title>QBE-STD</title>
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <Grid.Column>
                <Container text>
                <Header as='h1'>
                    Upload your files
                </Header>

                <Step.Group ordered fluid>
                    <Step active={step === 1} completed={step > 1}>
                        <Step.Content>
                            <Step.Title>Upload test file(s)</Step.Title>
                            <Step.Description>to search</Step.Description>
                        </Step.Content>
                    </Step>
                    <Step active={step === 2} disabled={step < 2} completed={step > 2}>
                        <Step.Content>
                            <Step.Title>Upload queries</Step.Title>
                            <Step.Description>(optional)</Step.Description>
                        </Step.Content>
                    </Step>
                    <Step active={step === 3} disabled={step < 3} completed={step > 3}>
                        <Step.Content>
                            <Step.Title>Edit queries</Step.Title>
                            <Step.Description>(optional)</Step.Description>
                        </Step.Content>
                    </Step>
                </Step.Group>

                {(step === 1) && (<Transition.Group animation='fade left' duration={500}>
                <Segment>
                    <Header as='h2'>
                        Step 1: Upload the test file(s) to search

                        <Dashboard id="step1" uppy={searchUploader} height={200} />
                    </Header>
                </Segment>
                </Transition.Group>)}

                {(step === 2) && (<Segment>
                    <Header as='h2'>Step 2: upload your queries</Header>

                    <Header as='h3'>Option 1: upload existing text/audio files</Header>
                    <p>(you can still edit your queries and labels after uploading)</p>

                    <Dashboard id='step2' uppy={queryUploader} height={200} />

                    <Header as='h3'>Option 2: start from scratch with your microphone</Header>

                </Segment>)}

                {(step === 3) && (<Segment>
                    <Edit files={queryFiles}/>
                </Segment>)}

                </Container>
            </Grid.Column>
        </Grid>
    );
}

export default Upload
