import React from "react";
import { Paper } from "@material-ui/core";
import { Typography } from "@material-ui/core";

export default function PageFooter() {

    return (
        <footer>
            <Paper>
                <Typography>
                    {process .env.DEV_MODE ? 
                    (`see <a href="${process.env.API_URL_LOCAL}/graphql">Graph<em>i</em>QL</a> to interact with the GraphQL endpoint`) : 
                    (`see <a href="${process.env.API_URL_PROD}/graphql">Graph<em>i</em>QL</a> to interact with the GraphQL endpoint`)
                    }               
                </Typography>
            </Paper>
        </footer>
    )
}