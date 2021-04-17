import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { Container, Header, Icon, Grid, Form, TextArea, List, Segment, Button, Transition, Step, Table } from 'semantic-ui-react'

const Status = () => {
    const router = useRouter()
    const { id } = router.query

    return (
        <Grid style={{ height: '100vh' }} verticalAlign='middle' centered>
            <Head>
              <title>QBE-STD</title>
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <Grid.Column>
                <Container text>
                    <Header as='h1' dividing>
                        <Icon name='cogs' circular inverted color='teal'/>
                        Job status #{id}
                    </Header>


                    <p>When they are ready, query results will be displayed here. You can click on queries or files in the table to see more details and results.</p>

                    <Table celled striped>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>
                                    Query label
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Audio
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row negative>
                                <Table.Cell>
                                    Query (not done yet)
                                </Table.Cell>
                                <Table.Cell>
                                    Filename (not done yet)
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row positive>
                                <Table.Cell selectable>
                                    <Link href='/query/123'>
                                        Some query (clickable)
                                    </Link>
                                </Table.Cell>
                                <Table.Cell selectable>
                                    <Link href='/test/123'>
                                        Some filename (clickable)
                                    </Link>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>

                    <Link href='/upload'>
                        <Button floated='right'>New search</Button>
                    </Link>
                </Container>
            </Grid.Column>
        </Grid>
    );
}

export default Status
