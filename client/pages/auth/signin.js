import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router'
import { TextField, Button } from '@material-ui/core'

export default () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { doRequest, errors } = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: { email, password },
        onSuccess: () => Router.push('/')
    })

    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(email, password)
        doRequest()
    }

    const textStyle = { minWidth: '35%', marginTop: '15px' }

    return (
        <div>

            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '35%' }}>
                <TextField
                    style={textStyle}
                    variant="filled"
                    placeholder="sholmes@221b.st"
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)} />
                <TextField
                    style={textStyle}
                    variant="filled"
                    label="Password"
                    placeholder="******"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)} />

                <button className="btn btn-light" style={textStyle} >Login</button>
                <br />
                {errors}
            </form>
        </div>
    )

}