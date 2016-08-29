import * as React from "react";
import * as ReactDOM from "react-dom";

import { UserInfo } from "./UserInfo";

ReactDOM.render(
    <UserInfo name="Mr. Anderson" email="anderson@example.com" />,
    document.getElementById("example")
);
