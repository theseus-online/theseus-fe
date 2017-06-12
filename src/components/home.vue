<template>
    <div>
        <Row style="margin-top: 25px;">
            <Col span="16" offset="4">
                <Steps :current="2">
                    <Step title="preview" content="2017/4/21 basic concept"></Step>
                    <Step title="alpha" content="2017/4/30 secure"></Step>
                    <Step title="beta" content="2017/5/06 network isolation & custom command"></Step>
                    <Step title="release" content="2017/7/20 more feature..."></Step>
                </Steps>
            </Col>
        </Row>
        <Row style="margin-top: 25px;">
            <Col span="16" offset="4">
                <Alert type="warning">This is the alpha version for testing, do NOT use as production environment.</Alert>
                <Alert type="info">See our <a href="http://blog.theseus.online" target="view_window">blog</a> for more information.</Alert>
            </Col>
        </Row>
    </div>
</template>
