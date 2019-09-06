import React, { Component } from 'react';
import Axios from 'axios'
import {connect} from 'react-redux'
import {urlApi} from '../../3.Helpers/database'
import swal from 'sweetalert'
import {tambahCart} from '../../redux/1.actions'
import {Link} from 'react-router-dom'
import {Redirect} from 'react-router-dom'

class Cart extends Component {
    state = {
        cartData : [],
        isCheckout : false,
        inputPenerima : '',
        inputAlamat : '',
        inputKodePos : '',
        inputUang : 0
    }

    componentWillReceiveProps(newProps){
        this.getDataCart(newProps.id)
    }

    componentDidMount(){
        this.getDataCart(this.props.id)
        this.props.tambahCart(this.props.id)
    }

    componentDidUpdate(){
        this.props.tambahCart(this.props.id)
    }

    deleteCartItem = (id) => {
        Axios.delete(urlApi + 'cart/' + id)
        .then((res) => {
            swal('Success', 'Item Deleted', 'success')
            this.getDataCart(this.props.id)
        })
        .catch((err) => {
            swal('Error', 'There is an error', 'error')
        })
    }

    getDataCart = (id) => {
        Axios.get(urlApi + 'cart?userId=' + id)
        .then(res => {
            console.log(res)
            this.setState({cartData : res.data})
        })
        .catch(err => {
            console.log(err)
        })
    }



    renderCart = () => {
        var jsx = this.state.cartData.map((val, idx) => {
            return (
                <tr>
                    <td>{val.productName}</td>
                    <td>{val.price - (val.price * (val.discount/100))}</td>
                    <td><div className="btn-group">
                        <button type="button" className="btn btn-secondary" onClick={() => this.onBtnEditQty('min', idx)}>-</button>
                        <button type="button" className="btn btn-secondary">{val.quantity}</button>
                        <button type="button" className="btn btn-secondary" onClick={() => this.onBtnEditQty('add', idx)}>+</button>
                    </div></td>
                    <td>{(val.price - (val.price * (val.discount/100))) * val.quantity}</td>
                    <td><input type="button" className="btn btn-danger btn-block" onClick={() => this.deleteCartItem(val.id)} value="Delete"/></td>
                </tr>
            )
        })

        return jsx
    }

    onBtnEditQty = (action, idx) => {
        let arrCart = this.state.cartData

        if(action == 'min'){
            if(arrCart[idx].quantity > 1){
                arrCart[idx].quantity -= 1
                Axios.put(urlApi + 'cart/' + arrCart[idx].id, arrCart[idx])
                .then(res => this.getDataCart(this.props.id))
                .catch(err => console.log(err))
            }
        }else if(action == 'add'){
            arrCart[idx].quantity += 1
            Axios.put(urlApi + 'cart/' + arrCart[idx].id, arrCart[idx])
            .then(res => this.getDataCart(this.props.id))
            .catch(err => console.log(err))
        }
    }

    renderTotalCart = () => {
        let result = 0
        this.state.cartData.map(val => {
            result += val.quantity * (val.price - (val.price * (val.discount / 100)))
        })

        return result
    }

    onBtnPay = () => {
        let d = new Date()
        let today = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
        let totalPrice = this.renderTotalCart()
        let items = this.state.cartData
        let newData = {
            userId : this.props.id,
            items,
            time : today,
            totalPrice,
            recipient : this.state.inputPenerima,
            postalCode : this.state.inputKodePos,
            address : this.state.inputAlamat,
        }

        if(totalPrice > this.state.inputUang){
            swal('Uang tidak cukup', 'uang anda tidak mencukupi', 'error')
        }else if(this.state.inputUang > totalPrice){
            swal('Success', 'Uang kembalian anda = ' + (this.state.inputUang -  totalPrice), 'success')
            Axios.post(urlApi + 'history', newData)
            .then(res=>{
                console.log(res)
                // this.getDataCart()
                this.props.tambahCart(this.props.id)
            })
            .catch(err=>{
                console.log(err)
            })
            for(var i = 0; i < this.state.cartData.length; i++){
                Axios.delete(urlApi + 'cart/' + this.state.cartData[i].id)
                .then(res=>{
                    console.log(res)
                    this.getDataCart()
                    
                })
                .catch(err=>{
                    console.log(err)
                })
            }
        }else{
            swal('Uang anda pas', 'Terimakasih telah membayar dengan uang pas', 'success')
            Axios.post(urlApi + 'history', newData)
            .then(res=>{
                console.log(res)
                this.getDataCart()
                this.props.tambahCart(this.props.id)
            })
            .catch(err=>{
                console.log(err)
            })
            for(var i = 0; i < this.state.cartData.length; i++){
                Axios.delete(urlApi + 'cart/' + this.state.cartData[i].id)
                .then(res=>{
                    console.log(res)
                    this.getDataCart()
                })
                .catch(err=>{
                    console.log(err)
                })
            }
        }

    }

    render() {
        if(this.state.cartData === null){
            return('bebas')
        } else if (this.props.id === 0){
            return (<Redirect to="/" exact/>)
        }
        return (
            <div className="container">
                <table className="table mt-3 text-center">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderCart()}
                    </tbody>
                </table>
                <div>
                {
                    this.state.cartData.length > 0
                    ?
                <div className="row">
                    <div className="col-8">
                        <input type="button" onClick={() => this.setState({isCheckout : !this.state.isCheckout})} className="btn btn-success btn-block" value="CHECKOUT"/>
                    </div>
                    <div className="col-4">
                        <h3>Total Harga = {this.renderTotalCart()}</h3>
                    </div>
                </div>
                :
                <div>
                  <h4>Your cart is empty, let's <Link to='/'>Go Shooping</Link></h4>
                   
                </div>
                }
                </div>
                {
                    this.state.isCheckout
                ?
                <div className="row mt-4">
                    <div className="col-10">
                        <div className="row">
                            <div className="col-6">
                                <input type="text" onChange={(e) => {this.setState({inputPenerima : e.target.value})}} className="form-control" placeholder="Nama Penerima"/>
                            </div>
                            <div className="col-6">
                                <input type="button" value="PAY" onClick={this.onBtnPay} className="btn btn-primary btn-block"/>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-8">
                                <input type="text" onChange={(e) => {this.setState({inputAlamat : e.target.value})}} className="form-control" placeholder="Alamat"/>
                            </div>
                            <div className="col-4">
                                <input type="text" onChange={(e) => {this.setState({inputKodePos : e.target.value})}} className="form-control" placeholder="Kode Pos"/>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                                <input type="number" onChange={(e) => {this.setState({inputUang : e.target.value})}} className="form-control" placeholder="Uang situ"/>
                            </div>
                        </div>
                    </div>
                </div>
                :
                null
                }
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

export default connect(mapStateToProps ,{tambahCart})(Cart)