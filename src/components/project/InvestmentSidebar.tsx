import { TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface InvestmentDetails {
  purchase_price: number;
  reform_cost: number | null;
  total_investment: number;
  current_value: number | null;
  monthly_rent: number | null;
  annual_return: number;
}

interface InvestmentSidebarProps {
  type: string;
  investment_details: InvestmentDetails;
}

export function InvestmentSidebar({ type, investment_details }: InvestmentSidebarProps) {
  const { t } = useTranslation();
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  return (
    <>
      <h3 className="text-lg font-bold text-neutral-800" style={{ marginBottom: '1rem' }}>Datos de inversión</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
          <span className="text-neutral-600">{t('portfolio.details.type')}</span>
          <span className="font-medium text-neutral-800">{t(`portfolio.types.${type}`)}</span>
        </div>
        {investment_details.purchase_price > 0 && (
          <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
            <span className="text-neutral-600">Precio de compra</span>
            <span className="font-medium text-neutral-800">{formatCurrency(investment_details.purchase_price)}</span>
          </div>
        )}
        {investment_details.reform_cost && (
          <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
            <span className="text-neutral-600">Coste de reforma</span>
            <span className="font-medium text-neutral-800">{formatCurrency(investment_details.reform_cost)}</span>
          </div>
        )}
        {investment_details.total_investment > 0 && (
          <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
            <span className="text-neutral-600">{t('portfolio.details.investment')}</span>
            <span className="font-bold text-primary-500">{formatCurrency(investment_details.total_investment)}</span>
          </div>
        )}
        {investment_details.current_value && (
          <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
            <span className="text-neutral-600">Valor actual</span>
            <span className="font-medium text-neutral-800">{formatCurrency(investment_details.current_value)}</span>
          </div>
        )}
        {investment_details.monthly_rent && (
          <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
            <span className="text-neutral-600">Renta mensual</span>
            <span className="font-medium text-neutral-800">{formatCurrency(investment_details.monthly_rent)}</span>
          </div>
        )}
        {investment_details.annual_return > 0 && (
          <div className="flex justify-between items-center" style={{ paddingTop: '0.5rem' }}>
            <span className="text-neutral-800 font-medium">{t('portfolio.details.return')}</span>
            <span className="flex items-center text-green-600 font-bold text-xl">
              <TrendingUp className="w-5 h-5" style={{ marginRight: '0.25rem' }} />
              {Math.round(100 * investment_details.annual_return)}%
            </span>
          </div>
        )}
      </div>
      <p className="text-xs text-neutral-500" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-neutral-200)' }}>
        Los datos financieros son orientativos y pueden variar según las condiciones del mercado.
      </p>
    </>
  );
}
