import Image from 'next/image';
const bankLogos=[
['/images/bank/addiko-bank.png','Addiko Bank'],
['/images/bank/aikbank.png','AIK Bank'],
['/images/bank/banca-transilvania.png','Banca Transilvania'],
['/images/bank/bigbank.png','Bigbank'],
['/images/bank/bnp-paribas.png','BNP Paribas'],
['/images/bank/bulgarian-american-credit-bank.png','Bulgarian American Credit Bank'],
['/images/bank/citadele.png','Citadele'],
['/images/bank/erste-group.png','Erste Group'],
['/images/bank/eurobank.png','Eurobank'],
['/images/bank/exim-banca-romaneasca.png','Exim Banca Românească'],
['/images/bank/fibank.png','Fibank (First Investment Bank)'],
['/images/bank/garanti-bbva.png','Garanti BBVA'],
['/images/bank/halkbank.png','Halkbank'],
['/images/bank/ing.png','ING'],
['/images/bank/intesa-sanpaolo.png','Intesa Sanpaolo'],
['/images/bank/kbc.png','KBC'],
['/images/bank/libra-internet-bank.png','Libra Internet Bank'],
['/images/bank/luminor.png','Luminor'],
['/images/bank/mbank.png','mBank'],
['/images/bank/nlb.png','NLB'],
['/images/bank/otp-bank.png','OTP Bank'],
['/images/bank/procredit-bank.png','ProCredit Bank'],
['/images/bank/raiffeisen-bank.png','Raiffeisen Bank'],
['/images/bank/santander.png','Santander'],
['/images/bank/societe-generale.png','Societe Generale'],
['/images/bank/swedbank.png','Swedbank'],
['/images/bank/tbi-bank.png','TBI Bank'],
['/images/bank/unicredit.png','UniCredit'],
['/images/bank/procredit-bank2.png','ProCredit'],
['/images/bank/fincombank.png','FincomBank']

] as const;
export default function BankLogoGrid(){
  return <div className="bank-logo-grid">
    {bankLogos.map(([src,name],i)=>
      <div className="logo-interactive" key={`${src}-${i}`}>
        <Image src={src} alt={name} fill sizes="(max-width:720px) 50vw, 20vw"/>
      </div>
    )}
  </div>;
}