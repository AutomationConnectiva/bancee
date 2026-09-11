function directDrive(url: string) {
  const match = url.match(/\/file\/d\/([^/]+)/);

  return match
    ? `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`
    : url;
}

const bankLogos = [
  [directDrive('https://drive.google.com/file/d/1V0LbpuJxHRO-o1nHhSYgm77srJb9Wpcw/view?usp=drive_link'), 'Addiko Bank'],
  [directDrive('https://drive.google.com/file/d/13QNkdyNIpQGJDfvV7JVFftwPjK7jG_xH/view?usp=drive_link'), 'AikBank'],
  [directDrive('https://drive.google.com/file/d/1lghueUSHbnpUqbP9Vo7jpbp0a7KWHo8w/view?usp=drive_link'), 'Banca Transilvania'],
  [directDrive('https://drive.google.com/file/d/1FRolRNt7aLC-1P3TnvfOZjC2HIPvIqlQ/view?usp=drive_link'), 'Bigbank'],
  [directDrive('https://drive.google.com/file/d/1thRE5QLO6MAwe4lz1ZtKE-yLWmMQOYw-/view?usp=drive_link'), 'bnp paribas'],
  [directDrive('https://drive.google.com/file/d/14dichBZ8M3oEjwlYWIrSiQHnHbkryB-i/view?usp=drive_link'), 'Bulgarian American Credit Bank'],
  [directDrive('https://drive.google.com/file/d/1GZh_QZoH-IaugyzocJnIawkKAIgawTAH/view?usp=drive_link'), 'Citadele'],
  [directDrive('https://drive.google.com/file/d/1UGx6dGl4kVu32hedNQw_lJdEbjE-z83g/view?usp=drive_link'), 'Erste Group'],
  [directDrive('https://drive.google.com/file/d/1jQDcD3vStc6j6w4xXJC3Olh3TLk82imn/view?usp=drive_link'), 'Eurobank'],
  [directDrive('https://drive.google.com/file/d/1fAxw7aW87BO3Wd2d3c6KWpKPar6S7s5k/view?usp=drive_link'), 'Exim Banca România'],
  [directDrive('https://drive.google.com/file/d/1mjeN3IOmqsBluJoqHFEZkCgkgqwxG0iC/view?usp=drive_link'), 'Fibank'],
  [directDrive('https://drive.google.com/file/d/1wE3Ic7YsSk8H1hl4N_-GfzrFdKz5ZpwH/view?usp=drive_link'), 'Fincombank'],
  [directDrive('https://drive.google.com/file/d/11wnAnFLyZUxZ-gDXEMiKhwfRd3WrHyI2/view?usp=drive_link'), 'Garranti BBVA'],
  [directDrive('https://drive.google.com/file/d/1jCFm8yug5GndxOe7b3f8eJZ2Epw6zC6w/view?usp=drive_link'), 'HalkBank'],
  [directDrive('https://drive.google.com/file/d/1oZZblDKjLFCCaTmBiw1ne6JiLSZR9SzX/view?usp=drive_link'), 'ING'],
  [directDrive('https://drive.google.com/file/d/1NhFcD-uZ1bG3X658g8VRE6i5AHlVx8YI/view?usp=drive_link'), 'Intesa Sanpaolo'],
  [directDrive('https://drive.google.com/file/d/1eyvBbD0aCBEs7_s0lST8SaFF379rfwiJ/view?usp=drive_link'), 'KBC'],
  [directDrive('https://drive.google.com/file/d/16_uSk9pswhwcbZWMuUjDIIY8wvsjcD9t/view?usp=drive_link'), 'lIBRA Internet Bank'],
  [directDrive('https://drive.google.com/file/d/1SEdPaLefury16xeJAAZklrAO_Atyha4Z/view?usp=drive_link'), 'Luminor'],
  [directDrive('https://drive.google.com/file/d/15Lizv2pVREVyx3ofaf1x5wCg6z4KJ4Xp/view?usp=drive_link'), 'mBank'],
  [directDrive('https://drive.google.com/file/d/1Fp2JLugROUjrpD6v11SXomeJ0M2byhoq/view?usp=drive_link'), 'NLB'],
  [directDrive('https://drive.google.com/file/d/1ld3bVNpzilZEC2Rz_a_zplLI50pApWad/view?usp=drive_link'), 'OTP Bank'],
  [directDrive('https://drive.google.com/file/d/1NTVGL7pgcGHm3ifvdGJ16N0xgjbgyiDx/view?usp=drive_link'), 'ProCredit Bank'],
  [directDrive('https://drive.google.com/file/d/1_M-amM9tGzAYvmKB_sw2b7-4wJREytGY/view?usp=drive_link'), 'citi'],
  [directDrive('https://drive.google.com/file/d/1GUc6e-VwrgS-E06b29ns8JzSd4joOLV1/view?usp=drive_link'), 'Raiffeisen Bank International'],
  [directDrive('https://drive.google.com/file/d/1TY0qKEwuVqxiDOllj6jz_pkFoEItDxtf/view?usp=drive_link'), 'Santander'],
  [directDrive('https://drive.google.com/file/d/1vSbaCdJRYsy_anek22OdndOJsmG1KiWs/view?usp=drive_link'), 'Société Générale'],
  [directDrive('https://drive.google.com/file/d/1uy8FA3aFV5oc0ddNhrjlzqm8O6I01PSI/view?usp=drive_link'), 'Swedbank'],
  [directDrive('https://drive.google.com/file/d/1Zz6HqVIxe1Q7uNgc_hSPdG83yme_2xZH/view?usp=drive_link'), 'TBI bank'],
  [directDrive('https://drive.google.com/file/d/1h1EAXfLVfb69pX2D-nzIuuMc-IKO6_p1/view?usp=drive_link'), 'Unicredit'],
] as const;

export default function BankLogoGrid() {
  return (
    <div className="bank-logo-grid">
      {bankLogos.map(([src, name], i) => (
        <div className="logo-interactive" key={`${name}-${i}`}>
          <img
            src={src}
            alt={name}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}