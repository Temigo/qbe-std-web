import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { Container, Header, Icon, Grid, Form, TextArea, List, Segment, Button, Transition, Step, Table } from 'semantic-ui-react'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

function useQuery (id) {
  const { data, error } = useSWR(`${process.env.API_URL}/api/v1/results?query_id=${id}`, fetcher)

  return {
    query: data,
    isLoading: !error && !data,
    isError: error
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
    console.log(`${process.env.API_URL}/api/v1/results?query_id=${id}`)

    const { query, isLoading, isError } = useQuery(id)

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
                        Query #{id}
                    </Header>

                    <List divided>
                        {!isLoading && !isError && (query.map((item, itemIndex) => (
                            <List.Item key={itemIndex}>
                                {item.test}, {item.match_start}, {item.match_end}, {item.score}
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
