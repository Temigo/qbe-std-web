import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { Container, Header, Icon, Grid, Form, TextArea, List, Segment, Button, Transition, Step, Table, Card, Input } from 'semantic-ui-react'
import useSWR from 'swr'
import React, { useRef, useEffect, Component, useState } from "react";
import Audio from '../../components/audio.js'

//const fetcher = (...args) => fetch(...args).then(res => res.json())
const fetcher = url => fetch(url).then(r => r.json())

function useQuery (id) {
  const { data: results, error } = useSWR(id !== undefined ? `${process.env.API_URL}/api/v1/results?query_id=${id}` : null, fetcher)
  const { data: info, error2 } = useSWR(id !== undefined ? `${process.env.API_URL}/api/v1/info?file_id=${id}` : null, fetcher)
  console.log(id, results, info)
  console.log(error, error2)
  return {
    results: results,
    info: info,
    isLoading: !error && !results && !error2 && !info,
    isError: error || error2
  }
}

function useTest (id) {
  const { data, error } = useSWR(`${process.env.API_URL}/api/v1/results?test_id=${id}`, fetcher)

  return {
    test: data,
    isLoading: !error && !data,
    isError: error
  }
}


const Query = () => {
    const router = useRouter()
    const { id } = router.query
    const { results, info, isLoading, isError } = useQuery(id)

    return (
        <Grid style={{ height: '100vh', paddingTop: '3em' }} verticalAlign='middle' centered>
            <Head>
              <title>QBE-STD</title>
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <Grid.Column>
                <Container text>
                    <Header sub>Query</Header>
                    <Header size='huge' style={{fontFamily: 'sans-serif'}}>
                        {!isLoading && !isError && info !== undefined && (<p>{info.f_name}</p>)}
                    </Header>
                    <Header size='tiny' dividing> #{id}</Header>

                    <Segment basic floated="right" >
                        <Form>
                            <Form.Field inline>
                                <label>Threshold</label>
                                <Input type="range" min="20" max="1000" step="100" defaultValue="0"/>
                            </Form.Field>
                        </Form>
                    </Segment>

                    <div style={{clear: "both"}} />

                    <List divided>
                        {!isLoading && !isError && results !== undefined && (results.map((item, itemIndex) => (
                            <List.Item key={itemIndex}>
                                <Card fluid>
                                    <Card.Content>
                                        <Card.Meta>Score: {item.score}</Card.Meta>
                                        <Card.Description>
                                            <Grid divided>
                                                <Grid.Column width={14}>
                                                    <Audio start={item.match_start} end={item.match_end} test={item.test} />
                                                </Grid.Column>
                                                <Grid.Column stretched width={2}>
                                                    <Button positive icon="check" />
                                                    <Button negative icon="cancel" />
                                                </Grid.Column>
                                            </Grid>
                                        </Card.Description>
                                    </Card.Content>
                                </Card>
                            </List.Item>
                        )))}
                    </List>

                    <Link href='/status/123'>
                        <Button primary>
                            <Icon name='chevron left' />
                            Back
                        </Button>
                    </Link>
                </Container>
            </Grid.Column>
        </Grid>
    );
}

export default Query
