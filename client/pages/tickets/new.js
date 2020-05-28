import { useState } from 'react';
import { TextField } from '@material-ui/core'
import Router from 'next/router'
import useRequest from '../../hooks/use-request';

const NewTicket = () => {
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')

    const { doRequest, errors } = useRequest({
        url: "/api/tickets",
        method: 'post',
        body: {
            title, price
        },
        onSuccess: () => Router.push("/")
    })

    const onSubmit = (event) => {
        event.preventDefault()
        doRequest()
    }
    const formatInput = () => {
        const value = parseFloat(price)

        if (isNaN(value)) {
            return
        }
        if (value < 0.0) {
            setPrice(0)
            return
        }
        setPrice(value.toFixed(2))

    }
    return (
        <div>
            <h1> Create New Ticket</h1>
            <form onSubmit={onSubmit}>
                <div >
                    <TextField variant="outlined"
                        label="Title"
                        size="small"
                        value={title}
                        onChange={e => setTitle(e.target.value)} />
                </div>
                <br />
                <div >
                    <TextField variant="outlined"
                        label="Price"
                        size="small"
                        type="number"
                        value={price}
                        onBlur={formatInput}
                        onChange={e => setPrice(e.target.value)}
                    />
                </div>
                <br />
                <button className="btn btn-outline-primary">Sign in</button>
                {errors}
            </form>
        </div>
    )
}
export default NewTicket