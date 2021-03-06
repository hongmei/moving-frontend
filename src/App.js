import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { Elements, StripeProvider } from "react-stripe-elements";

import "./App.css";
import Home from "./pages/Home";

import reducer from "./redux/reducers";
import TopBar from "./pages/booking/TopBar";
import LocationSelect from "./pages/booking/LocationSelect";
import CategorySelect from "./pages/booking/CategorySelect";
import VehicleSelect from "./pages/booking/VehicleSelect";
import TimeSelect from "./pages/booking/TimeSelect";
import PricePreview from "./pages/booking/PricePreview";
import Checkout from "./pages/booking/Checkout";

const store = createStore(reducer);

function App() {
	return (
		<Provider store={store}>
			<div>
				<BrowserRouter>
					<Switch>
						<Route exact path="/" component={Home} />
						<Route>
							<TopBar />
							<Route exact path="/book" component={CategorySelect} />
							<Route exact path="/book/location" component={LocationSelect} />
							<Route exact path="/book/vehicle" component={VehicleSelect} />
							<Route exact path="/book/time" component={TimeSelect} />
							<Route exact path="/book/preview" component={PricePreview} />
							{/* <Route exact path="/book/checkout" component={Checkout} /> */}
							<Route
								exact
								path="/book/checkout"
								render={() => (
									<StripeProvider apiKey="pk_test_TYooMQauvdEDq54NiTphI7jx">
										<Elements>
											<Checkout />
										</Elements>
									</StripeProvider>
								)}
							/>
						</Route>
					</Switch>
				</BrowserRouter>
			</div>
		</Provider>
	);
}

export default App;
