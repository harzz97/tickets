import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router'

export default () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { doRequest, errors } = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: { email, password },
        onSuccess: () => Router.push('/')
    })

    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(email, password)
        doRequest()
    }
    return (
        <form onSubmit={onSubmit}>
            <h1>Signup</h1>
            <div className="form-group">
                <label>Email</label>
                <input
                    className="form-control"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    className="form-control"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)} />
            </div>
            <button className="btn btn-outline-primary">Sign Up</button>
            {errors}
        </form>
    )

}