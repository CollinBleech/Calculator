import React, { Component } from 'react';
import { Row, Col, ButtonGroup, Button, Alert, ListGroup, ListGroupItem } from 'reactstrap';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            query: "",
            error: "",
            history: []
        };
    }

    handleInput(input) {
        this.setState({ query: this.state.query + input });
    }

    // Removes the last entered character
    delete() {
        this.setState({ query: this.state.query.slice(0, -1) });
    }

    // Clears entry and error if there was one
    clear() {
        this.setState({ query: "", error: "" });
    }

    async enter() {
        console.log(this.state.query);

        // Converting + to p due to double escape sequence filter with IIS
        var query = encodeURIComponent(this.state.query.replaceAll('+', 'p'));
        if (query == "")
            query = "0";

        const response = await fetch('api/calculator/' + query);
        const data = await response.json();

        if (data.error != "") {
            this.state.history.push({ 'query': this.state.query, 'result': data.error, 'error': true });
            this.setState({ error: data.error });
        }
        else {
            this.state.history.push({ 'query': this.state.query, 'result': data.result, 'error': false });
            this.setState({ query: data.result, error: data.error });
        }
    }

    renderError() {
        if (this.state.error != "")
            return (
                <Alert color="danger">{this.state.error}</Alert>
            );
    }

    renderHistory() {
        var entries = [];

        if (this.state.history.length > 0) {
            this.state.history.forEach(entry => {
                if (entry.error)
                    entries.unshift(<ListGroupItem color="danger">test</ListGroupItem>);
                else
                    entries.unshift(<ListGroupItem>test</ListGroupItem>);
            })

            return (
                <Row>
                    <Col>
                        <ListGroup>
                            {entries}
                        </ListGroup>
                    </Col>
                </Row>
            );
        }
    }

    render () {
        return (
            <Row id="calculator">
                <Col>
                    {this.renderError()}
                    <Row>
                        <Col><div class="form-control" id="display">{this.state.query}</div></Col>
                    </Row>
                    <Row>
                        <Col>
                            <Row>
                                <Col><Button color="primary" size="lg" block="true" onClick={() => this.handleInput(7)}>7</Button></Col>
                                <Col><Button color="primary" size="lg" block="true" onClick={() => this.handleInput(8)}>8</Button></Col>
                                <Col><Button color="primary" size="lg" block="true" onClick={() => this.handleInput(9)}>9</Button></Col>
                            </Row>
                            <Row>
                                <Col><Button color="primary" size="lg" block="true" onClick={() => this.handleInput(4)}>4</Button></Col>
                                <Col><Button color="primary" size="lg" block="true" onClick={() => this.handleInput(5)}>5</Button></Col>
                                <Col><Button color="primary" size="lg" block="true" onClick={() => this.handleInput(6)}>6</Button></Col>
                            </Row>
                            <Row>
                                <Col><Button color="primary" size="lg" block="true" onClick={() => this.handleInput(1)}>1</Button></Col>
                                <Col><Button color="primary" size="lg" block="true" onClick={() => this.handleInput(2)}>2</Button></Col>
                                <Col><Button color="primary" size="lg" block="true" onClick={() => this.handleInput(3)}>3</Button></Col>
                            </Row>
                            <Row>
                                <Col><Button color="primary" size="lg" block="true" onClick={() => this.handleInput(0)}>0</Button></Col>
                                <Col><Button color="primary" size="lg" block="true" onClick={() => this.handleInput('.')}>.</Button></Col>
                                <Col>
                                    <ButtonGroup size="lg" className="w-100">
                                        <Button color="primary" onClick={() => this.handleInput('(')}>(</Button>
                                        <Button color="primary" onClick={() => this.handleInput(')')}>)</Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Col><Button size="lg" block="true" onClick={() => this.handleInput('*')}>*</Button></Col>
                                <Col><Button size="lg" block="true" onClick={() => this.handleInput('/')}>/</Button></Col>
                            </Row>
                            <Row>
                                <Col><Button size="lg" block="true" onClick={() => this.handleInput('+')}>+</Button></Col>
                                <Col><Button size="lg" block="true" onClick={() => this.handleInput('-')}>-</Button></Col>
                            </Row>
                            <Row>
                                <Col><Button color="danger" size="lg" block="true" onClick={() => this.delete()}>delete</Button></Col>
                                <Col><Button color="danger" size="lg" block="true" onClick={() => this.clear()}>clear</Button></Col>
                            </Row>
                            <Row>
                                <Col><Button color="success" size="lg" block="true" onClick={() => this.enter()}>enter</Button></Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}
