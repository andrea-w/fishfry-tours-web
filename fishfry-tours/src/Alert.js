import React, { useState } from "react";
import { Stack, Snackbar } from '@mui/material'
import MuiAlert from '@mui/material/Alert'

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export function ErrorSnackbar() {
    const [open, setOpen] = useState(true)

    const handleClose = (event) => {
        setOpen(false)
    }

    return (
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} autoHideDuration={3000} open={open} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error">Error adding boat - cannot duplicate boat name</Alert>
                </Snackbar>
            </Stack>
    )
    
}

export class SuccessSnackbar extends React.Component {
    open = true
    
    handleClose = (event) => {
        this.open = false
    }

    render() {
        return (
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} autoHideDuration={3000} open={this.open} onClose={this.handleClose}>
                    <Alert onClose={this.handleClose} severity="success">Successfully added new boat!</Alert>
                </Snackbar>
            </Stack>
        )
    }
}