import React, { Component } from 'react'
import Axios from 'axios'
import {connect} from 'react-redux'
import {urlApi} from '../../3.Helpers/database'
import {Redirect} from 'react-router-dom'

export class HistoryDetail extends Component {

    state ={
        historyDetail :{},
        item : []
    }


    componentDidMount = () => {
        this.getHistoryDetail()
    }

    getHistoryDetail = () => {
        Axios.get(urlApi + 'history/'+ this.props.match.params.id)
        .then((res) => {
            console.log(res)
            this.setState({historyDetail : res.data, item : res.data.items})
        })
        .catch((err) => console.log(err))
    }

    renderItems = () => {
        var history = this.state.item.map((val,idx) => {
            return (
                <tr>
                    <td>
                        {idx + 1}
                    </td>
                    <td>
                        {val.productName}
                    </td>
                    <td>
                        {val.quantity}
                    </td>
                    <td>
                        {val.price}
                    </td>
                   
                </tr>
            )
        })
        return history
    }

    render(){
        if(this.state.user === null){
            return('bebas')
        } else if (this.props.id === 0){
            return (<Redirect to="/" exact/>)
        }
            return(
                <div className='container'>
                    <table className="table col-md-8 col-12">
                                <thead>
                                    <tr>
                                        <th>Details {this.state.historyDetail.time}</th>
                                    </tr>
                                    <tr>
                                        <td>No</td>
                                        <td>Product Name</td>
                                        <td>Quantity</td>
                                        <td>Price</td>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderItems()}
                                </tbody>   
                                <tfoot>
                                    <tr>
                                        <td>Received by : {this.state.historyDetail.recipient }</td>
                                        <td>Address : {this.state.historyDetail.address}</td>
                                        <td>Postal Code : {this.state.historyDetail.postalCode}</td>
                                    </tr>
                                </tfoot>                             
                    </table>


                </div>
            )
       
    }
}

const mapStateToProps =(state) => {
    return {
        username : state.user.username
    }
}

export default connect(mapStateToProps)(HistoryDetail)
