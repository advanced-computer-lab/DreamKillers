import { useState } from 'react';
import './PaymentPage.module.css';
import StripeContainer from '../../Components/StripeElements/StripeContainer';

const PaymentPage = () => {
	const [showItem, setShowItem] = useState(false);
	return (
		<div className='paymentPage'>
			{showItem ? (
				<StripeContainer />
			) : (
				<>
					<h3>$10.00</h3>
					<button onClick={() => setShowItem(true)}>Purchase Your Flight</button>
				</>
			)}
		</div>
	);
}

export default PaymentPage;