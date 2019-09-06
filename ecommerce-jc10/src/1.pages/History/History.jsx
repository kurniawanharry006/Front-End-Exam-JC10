import React, { Component } from 'react';
import Axios from 'axios'
import {connect} from 'react-redux'
import {urlApi} from '../../3.Helpers/database'
import {Link} from 'react-router-dom'
import {Redirect} from 'react-router-dom'

class History extends Component {
        state = {
           historyData : [],
            
        }
    
        componentWillReceiveProps(newProps){
            this.getHistoryCart(newProps.id)
        }
    
        componentDidMount(){
            this.getHistoryCart(this.props.id)
        }
    
        
        getHistoryCart = (id) => {
            Axios.get(urlApi + 'history?userId=' + id)
            .then(res => {
                console.log(res)
                this.setState({historyData : res.data})
            })
            .catch(err => {
                console.log(err)
            })
        }
    
        renderHistory = () => {
            var jsy = this.state.historyData.map((val,idx) => {
                return (
                    <tr>
                        <td>{idx +1}</td>
                        <td>{val.time}</td>
                        <td>{val.items.length}</td>                      
                        <td>{val.totalPrice}</td>
                         <td><Link to={'/history-detail/' + val.id} style={{textDecoration:'none'}}>
                            see details
                             </Link>
                        </td>
                    </tr>
                )
            })
    
            return jsy
        }

    render() {
        if(this.state.historyData === null){
            return('bebas')
        } else if (this.props.id === 0){
            return (<Redirect to="/" exact/>)
        }
        return (
            <div className="container">
                <table className="table col-md-8 col-12">
                    <thead>
                        <tr>
                        <th scope="col">Transaction History</th>  
                        </tr>
                        <tr>
                            <td>No.</td>
                            <td>Date</td>
                            <td>Items</td>                           
                            <td>Total Price</td>
                            <td>Details</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderHistory()}
                    </tbody>
                    <tfoot>
                        {
                            this.state.historyData.length < 1 ?
                            <th><h4>Your cart is empty, let's <Link to='/'>Go Shooping</Link></h4></th>
                            :
                            null
                        }
                    </tfoot>
                </table>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        id : state.user.id,
        username : state.user.username
    }
}

export default connect(mapStateToProps)(History)