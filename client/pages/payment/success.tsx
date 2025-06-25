// pages/payment/success.tsx
const PaymentSuccessPage = () => (
  <div className="text-center p-10">
    <h1 className="text-3xl font-bold text-green-600">Pagamento Bem-Sucedido!</h1>
    <p className="mt-4">Obrigado pela sua assinatura. Sua conta foi atualizada.</p>
    <a href="/dashboard" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded">Ir para o Dashboard</a>
  </div>
);
export default PaymentSuccessPage;