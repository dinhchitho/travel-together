import { combineReducers } from "redux"
import { AppReducer } from "../App/App.reducer"
import { loginReducer } from "../pages/Login/Login.reducer"
// import { ProductListReducer } from "src/pages/Product/ProductList/ProductList.reducer"
// import { productItemReducer } from "src/pages/Product/ProductItem/ProductItem.reducer"

const rootReducer = combineReducers({
  app: AppReducer,
  login: loginReducer,
  // productList: ProductListReducer,
  // productItem: productItemReducer
})

export default rootReducer
