import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { Container, Header, Icon, Grid, Form, TextArea, List, Segment, Button, Transition, Step, Table } from 'semantic-ui-react'

const Test = () => {
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
                        <Icon name='question' circular inverted color='teal'/>
                        Test #{id}
                    </Header>

                    <p>More to come.</p>

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

export default Test
