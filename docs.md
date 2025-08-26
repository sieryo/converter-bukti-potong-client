[
  {
    "header": "Nomor Dok. Referensi",
    "rules": [
      {
        "when": { 
            field: "Faktur Pajak No",
            clause: "not_empty_and_not_zero" 
            },
        "value_from": "Faktur Pajak No"
      },
      {
        "when": { 
            field: "Faktur Pajak No",
            clause: "empty_or_zero" 
            header_from: "not_template"
            },
        "value_from": "Invoice / Kwitansi No"
      }
    ]
  },
  {
    "header": "Jenis Dok. Referensi",
    "rules": [
      {
        "when": { 
            field: "Faktur Pajak No" },
            clause: "not_empty_and_not_zero"
        "value": "TaxDocument"
      },
     {
        "when": { 
            field: "Faktur Pajak No" },
            clause: "not_empty_and_not_zero"
        "value": "TaxDocument"
      },
    ],
  },
]

ketika Nomor Dok. Referensi di proses, maka akan seperti ini pipelinenya:

di-cek rulesnya: check 

[TODO]
- Mendapatkan dan menyimpan data profil perusahaan lewat database.