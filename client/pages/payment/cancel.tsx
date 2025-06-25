// pages/payment/cancel.tsx
const PaymentCancelPage = () => (
  <div className="text-center p-10">
    <h1 className="text-3xl font-bold text-red-600">Pagamento Cancelado</h1>
    <p className="mt-4">Seu processo de pagamento foi cancelado. Você não foi cobrado.</p>
    <a href="/#pricing" className="mt-6 inline-block bg-gray-600 text-white px-6 py-2 rounded">Ver Planos Novamente</a>
  </div>
);
export default PaymentCancelPage;