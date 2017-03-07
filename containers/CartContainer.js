import _ from 'lodash';
import React, {
  Component,
  PropTypes
} from 'react'
import {
  connect
} from 'react-redux'
import {
  Link,
  browserHistory
} from 'react-router'
import {
  addToCart,
  submitForm,
  deleteForm,
  getAllProducts,
  getCart,
  clientRender,
  step
} from '../actions'
import {
  getCartProducts
} from '../reducers'
import Cart from '../components/Cart'
import CartInfo from '../components/CartInfo'
import ApplicantForm from '../components/ApplicantForm'
import OrderStep from '../components/OrderStep'

class CartContainer extends Component {
  static fetchData({
    store,
    cookie
  }) {
    return store.dispatch(getAllProducts(cookie)).
    then(() => store.dispatch(getCart(cookie)))
  }
  constructor(props) {
    super(props)
    this.submitApplicants = () => this._submitApplicants()
    this.renderCart = () => this._renderCart()
    this.state={
      progress:1,
      detail:{
        nextBottom:"確認",
        lastBottom:"這是第一步"
      }
    }
  }
  componentDidMount() {
    if (this.props.serverRender) {
      this.props.clientRender()
    } else {
      this.props.getAllProducts().
      then(() => this.props.getCart())
    }
  }
  _submitApplicants() {
    const {
      applicants,
      submitForm,
      getCart
    } = this.props
    const submits = applicants.map(applicant => {
      let attributes = [
        'product_detail_id',
        'name',
        'birth',
        'gender',
        'ss_number',
        'school',
        'grade',
        'food_preference',
        'note',
        'parent_phone_number',
        'parent_email'
      ]
      let arr = attributes.map(key => {
        return {
          [key]: this.refs[`applicant_${applicant.id}`].refs.form[key].value
        }
      })
      console.log(arr)
      const payload = Object.assign({}, ...arr)

      return submitForm('edit', 'line_items', applicant.id, payload)
    })
    return Promise.all(submits).then(() => getCart(), err => Promise.reject(err))
  }
  render() {
    const {
      products,
      applicants,
      addToCart,
      deleteForm,
      getCart,
      cart_matchable_discount_name,
      cart_matchable_discount_factor,
      total
    } = this.props
    const style = {
      paddingTop: '50px',
      minHeight: '600px'
    }
    const hasProducts = applicants.length > 0
    const defaultProductId = parseInt(Object.keys(products)[3])
    const nextStep = ()=>{
      
      console.log(this.state.progress);
      let detail = Object.assign({},this.state.detail);
      if (this.state.progress==1){
        this.submitApplicants().then( null, err => console.log(err));
        detail={nextBottom:"確認無誤並結帳",lastBottom:"回上一步"}
        this.setState({detail});
        this.setState({progress:this.state.progress+1});
      }
      else if (this.state.progress==2){
        detail={nextBottom:"付款",lastBottom:"回上一步"};
        this.setState({detail});
        this.submitApplicants().then(() => browserHistory.push('/orders/new'), err => console.log(err));
        this.setState({progress:this.state.progress+1});
      }

      
      console.log(this.state.progress);
    }
    const lastStep=()=>{
      console.log(this.state.progress);
      
      let detail = Object.assign({},this.state.detail);

      if (this.state.progress==2){
        detail={nextBottom:"確認",lastBottom:"這是第一步"}
        this.setState({detail});
        this.setState({progress:this.state.progress-1});
      }
      else if (this.state.progress==3){
        detail={nextBottom:"確認無誤並結帳",lastBottom:"回上一步"}
        this.setState({detail});
        this.setState({progress:this.state.progress-1});
      }

      console.log(this.state.progress);
    }
    return (
      <div className='container' style={style}>
        
        <center><h3>購物車</h3></center>
        <div className='row'>
        <div className = "col-md-6 col-md-offset-3 col-xs-10 col-xs-offset-1" 
        style={{
          padding:'0',
          paddingTop:'20px',
          paddingBottom:'20px',
        }}
        >
        <OrderStep progress={this.state.progress} />
        </div>
        </div>
        <div className='row'>
        <div className='col-md-6 col-md-offset-3 col-xs-10 col-xs-offset-1 cart-btns applicant-form'>
          <ul>
            <li>請輸入學生及聯絡人資料，並選擇這位學生要參加的梯次。</li>
            <li>若要團報，請先填寫一位學生的資料，點選“新增”按鈕；再填寫另一位學生的資料。</li>
          </ul>
          { 
            applicants.length > 0 
            ? <input type='submit' 
                     className='btn btn-info btn-sm pull-right' 
                     onClick={() => this.submitApplicants().
                       then(() => browserHistory.push('/orders/new'), 
                            err => console.log(err) )} 
                     value='結帳' />
            : <div/>
          }
          { 
            applicants.length > 0 
            ? <input type='submit' 
                     className='btn btn-success btn-sm pull-right' 
                     onClick={() => this.submitApplicants().
                        then( null, 
                              err => console.log(err) )} 
                     value='儲存' />
            : <div/>
          }
        </div>
        </div>
        {
          this.state.progress == 2 ?
          (applicants.length > 0
                    ? 
                    <div className = 'row'>
                    <div className='col-md-6 col-md-offset-3 col-xs-10 col-xs-offset-1 applicant-form'>
                    <CartInfo applicants={applicants} 
                                cart_matchable_discount_name={cart_matchable_discount_name}
                                cart_matchable_discount_factor={cart_matchable_discount_factor}
                                total={total} />
                    </div>
                    </div>
                    : <div/>)
          :<div/>
        }
        { this.state.progress == 1 ?
          (applicants.map(applicant => 
                      <div key={applicant.id} className='row'>
                        <div className='col-md-6 col-md-offset-3 col-xs-10 col-xs-offset-1 applicant-form'>
                          <ApplicantForm ref={`applicant_${applicant.id}`} 
                                         type='edit'
                                         products={products} 
                                         applicant={applicant}
                                         showDeleteBtn={true}
                                         onDelete={deleteForm}
                                         onDeleteCallback={getCart} />
                        </div>
                      </div>))
          :<div/>

        }
        <div className = 'row'>
        <div className='col-md-6 col-md-offset-3 col-xs-10 col-xs-offset-1 cart-add-btn' style={
          {
            marginTop:'10px',
            marginBottom:'10px'
          }
        }>
        <div className = 'row'>
        <button
        className="col-md-12 col-xs-12"
        style={
          {

            margin:'0',
            border:'0',
          }
        }
        onClick={
          ()=>{
          addToCart(defaultProductId,products[defaultProductId].product_details[0].id).
          then(() => getCart(), err => console.log(err));}
        } >
        <div className='row'>
          <div className="col-md-12 col-xs-12 cart-add-btn">
          <div className='row'>
            <div className="col-md-6 col-md-offset-3 col-xs-8 col-xs-offset-2">
              <span className="glyphicon glyphicon-plus cart-add-btn " aria-hidden="true"
              style = {
                {
                  margin: '0',
                  padding:'0 0 0.06em 0.07em',
                  border: '0.05em solid white',
                  fontSize:'2em',
                  color:'white',
                }
              }></span>
            </div> 
            </div>
          </div>
          </div>
        </button>
        </div>
        </div>
        </div>
        <div className = 'row'>
          <div className="col-md-6 col-md-offset-3 col-xs-10 col-xs-offset-1">
            <div className='row'>
              <button type="button" className="col-md-4 col-md-offset-0 col-xs-4 cart-next-btn"
              onClick={lastStep}
              >{this.state.detail.lastBottom}</button>
              <button type="button" className="col-md-4 col-md-offset-4 col-xs-4 col-xs-offset-4 cart-next-btn"
              onClick={nextStep}
              >{this.state.detail.nextBottom}</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

CartContainer.propTypes = {
  applicants: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired
  })).isRequired
}

const mapStateToProps = state => {
  return {
    products: state.products.byId,
    total: state.cart.form.price,
    applicants: state.cart.form.line_items,
    cart_matchable_discount_name: state.cart.form.matchable_discount_name,
    cart_matchable_discount_factor: state.cart.form.matchable_discount_factor,
    serverRender: state.serverRender
  }
}

export default connect(
  mapStateToProps, {
    getAllProducts,
    submitForm,
    deleteForm,
    getCart,
    clientRender,
    addToCart
  }
)(CartContainer)