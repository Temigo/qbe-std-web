import Head from 'next/head'
import Link from 'next/link'
import { Container, Header, Icon, Grid, Form, TextArea, List, Segment, Button } from 'semantic-ui-react'

import styles from '../styles/Home.module.css'

export default function Home()  {
    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Head>
              <title>QBE-STD</title>
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Segment circular textAlign='center' inverted padded='very' color='teal' style={{ width: 400, height: 400 }} vertical>
                    <Header as='h1' textAlign='center' style={{fontSize: '2em', marginTop: '1.5em'}}>
                        <Icon name='paper plane outline' />
                        Qbe-Std
                    </Header>
                    <Header as='h2' style={{fontSize: '1.5em', marginTop: '0.5em', marginBottom: '1em'}}>
                        Query audio by example
                    </Header>

                    <Link href='/upload'>
                        <Button inverted size='huge'>
                            Upload queries
                            <Icon name='right arrow' />
                        </Button>
                    </Link>
                </Segment>
            </Grid.Column>
        </Grid>
    );
}
