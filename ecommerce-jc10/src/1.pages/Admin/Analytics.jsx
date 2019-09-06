import React, { Component } from 'react'
import Axios from 'axios'
import {urlApi} from '../../3.Helpers/database'

export class Analytics extends Component {

    state = {
        data : [],
        totalIncome : 0,
        jmltrx :0
    }

    componentDidMount(){
        Axios.get(urlApi + 'history')
        .then(res => {
            console.log(res)
            this.setState({data : res.data})
            this.hitungTotal()
        })
        .catch(err => {
            console.log(err)
        })
    }

    hitungTotal = () => {
        this.state.data.map(val => {
            this.setState({totalIncome : val.totalPrice + this.state.totalIncome})
        })
        this.setState({jmltrx : this.state.data.length})

        
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow mt-3">
                            <div className="card-header border-0 pt-5">
                                <h3>Total Income</h3>
                            </div>
                            <div className="card-body">
                                <h4>Total pendapatan dari user belanja adalah Rp. {this.state.totalIncome}</h4>
                            </div>
                            <div className="card-footer align-items-center">
                                <h4>Pendapatan dihitung dari  {this.state.jmltrx} transaksi yang berhasil </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Analytics
