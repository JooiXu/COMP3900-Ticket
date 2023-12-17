import {
    Elements,
    CardElement,
    useElements,
    useStripe
  } from "@stripe/react-stripe-js";
  import { loadStripe } from "@stripe/stripe-js";
  import { useUser } from "../context/UserContext";
  import NavBar from "../components/NavBar";
  import { useHistory } from "react-router-dom";
  
  import { Button } from "@material-ui/core";
  const stripePromise = loadStripe("pk_test_51M0i1sHJFX5EY1UjVQfn5UDNJKCrwmNeHUD5tnS84tKbg0ExizT05zgCrJWWqYxAtTLrRFlLi5Ks0cav3pBjWyqS009DvWbDgq");
  
  const handleSubmit = (stripe, elements, user, setUser, history) => async () => {
    const cardElement = elements.getElement(CardElement)
    const usr = JSON.parse(user)
    const user_id = JSON.stringify(usr["user"].email)
    

    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    })
    
    if (error) {
      console.log('[error]', error)
    } else {
      console.log('[PaymentMethod]', JSON.stringify(paymentMethod.id))
      const response = await fetch('/api/user/payment/', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ "payment": paymentMethod.id, "user": user_id})
        })

        const resp = await response.json()

        if (response.status === 200) {
            console.log(resp)
            localStorage.setItem('user', JSON.stringify(resp))
            setUser(JSON.stringify(resp))
            history.push('/profile')
        } else {
            console.log(error)
        }   
    }

  };
  
  const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const { user, setUser} = useUser()
    const history = useHistory()

    return (
      <>
        
        <div style={{ margin: 'auto', width: '30%', height: '150px', position: 'absolute', top: '50%', left:'30%',  
        transform: 'translate(0, -50%)', border: '1px solid #000000', borderRadius:'10px', padding: '1%'}}>
            <p>Enter Card Details below</p>
            <CardElement />
        <Button style={{ marginTop:'7%' }} variant='outlined' onClick={handleSubmit(stripe, elements, user, setUser, history)}>Update Card Details</Button>
        </div>
      </>
    );
  }
  
  export const PaymentDetails  = () => (
    <div style={{ background:'#F5F6F6', height:'100vh'}}>
    <NavBar/>
        <div style={{ padding:'4%' }}>
            <Elements stripe={stripePromise} >
                <PaymentForm />
            </Elements>
        </div>
    </div>
  );