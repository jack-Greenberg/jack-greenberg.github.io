import React from 'react';

export class Content extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                {this.props.name}
            </div>
        )
    }
}
