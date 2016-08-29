import * as React from "react";

export interface User {
    name: string
    email: string
}

export class UserInfo extends React.Component<User, {}> {
    render() {
        return (
            <p>Name: {this.props.name}, email: <b>{this.props.email}</b>.</p>
        );
    }
}
