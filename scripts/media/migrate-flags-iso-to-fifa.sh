#!/bin/bash
# Migrate country flag PNG files in Azure Blob Storage from ISO codes to FIFA codes.
# Blobs with no FIFA mapping are deleted.
# Usage: op run --env-file .env -- bash scripts/migrate-flags-iso-to-fifa.sh

set -euo pipefail

CONTAINER="countries"
ACCOUNT="$AZURE_STORAGE_ACCOUNT_NAME"

# Authenticate using service principal
az login --service-principal \
  -u "$AZURE_CLIENT_ID" \
  -p "$AZURE_CLIENT_SECRET" \
  --tenant "$AZURE_TENANT_ID" \
  --output none

rename_blob() {
  local src="$1"
  local dst="$2"
  echo "Renaming $src -> $dst"
  az storage blob copy start \
    --account-name "$ACCOUNT" \
    --destination-container "$CONTAINER" \
    --destination-blob "$dst" \
    --source-account-name "$ACCOUNT" \
    --source-container "$CONTAINER" \
    --source-blob "$src" \
    --auth-mode login \
    --output none
  # Wait for copy to complete
  while true; do
    status=$(az storage blob show \
      --account-name "$ACCOUNT" \
      --container-name "$CONTAINER" \
      --name "$dst" \
      --auth-mode login \
      --query "properties.copy.status" \
      --output tsv 2>/dev/null || echo "success")
    if [[ "$status" == "success" || "$status" == "" ]]; then
      break
    fi
    sleep 1
  done
  az storage blob delete \
    --account-name "$ACCOUNT" \
    --container-name "$CONTAINER" \
    --name "$src" \
    --auth-mode login \
    --output none
}

delete_blob() {
  local name="$1"
  echo "Deleting $name (no FIFA mapping)"
  az storage blob delete \
    --account-name "$ACCOUNT" \
    --container-name "$CONTAINER" \
    --name "$name" \
    --auth-mode login \
    --output none
}

# --- Renames: ISO code -> FIFA code ---
rename_blob "ad.png" "AND.png"
rename_blob "ae.png" "UAE.png"
rename_blob "af.png" "AFG.png"
rename_blob "ag.png" "ATG.png"
rename_blob "ai.png" "AIA.png"
rename_blob "al.png" "ALB.png"
rename_blob "am.png" "ARM.png"
rename_blob "ao.png" "ANG.png"
rename_blob "ar.png" "ARG.png"
rename_blob "as.png" "ASA.png"
rename_blob "at.png" "AUT.png"
rename_blob "au.png" "AUS.png"
rename_blob "aw.png" "ARU.png"
rename_blob "az.png" "AZE.png"
rename_blob "ba.png" "BIH.png"
rename_blob "bb.png" "BRB.png"
rename_blob "bd.png" "BAN.png"
rename_blob "be.png" "BEL.png"
rename_blob "bf.png" "BFA.png"
rename_blob "bg.png" "BUL.png"
rename_blob "bh.png" "BHR.png"
rename_blob "bi.png" "BDI.png"
rename_blob "bj.png" "BEN.png"
rename_blob "bm.png" "BER.png"
rename_blob "bn.png" "BRU.png"
rename_blob "bo.png" "BOL.png"
rename_blob "br.png" "BRA.png"
rename_blob "bs.png" "BAH.png"
rename_blob "bt.png" "BHU.png"
rename_blob "bw.png" "BOT.png"
rename_blob "by.png" "BLR.png"
rename_blob "bz.png" "BLZ.png"
rename_blob "ca.png" "CAN.png"
rename_blob "cd.png" "COD.png"
rename_blob "cf.png" "CTA.png"
rename_blob "cg.png" "CGO.png"
rename_blob "ch.png" "SUI.png"
rename_blob "ci.png" "CIV.png"
rename_blob "ck.png" "COK.png"
rename_blob "cl.png" "CHI.png"
rename_blob "cm.png" "CMR.png"
rename_blob "cn.png" "CHN.png"
rename_blob "co.png" "COL.png"
rename_blob "cr.png" "CRC.png"
rename_blob "cu.png" "CUB.png"
rename_blob "cv.png" "CPV.png"
rename_blob "cw.png" "CUW.png"
rename_blob "cy.png" "CYP.png"
rename_blob "cz.png" "CZE.png"
rename_blob "de.png" "GER.png"
rename_blob "dj.png" "DJI.png"
rename_blob "dk.png" "DEN.png"
rename_blob "dm.png" "DMA.png"
rename_blob "do.png" "DOM.png"
rename_blob "dz.png" "ALG.png"
rename_blob "ec.png" "ECU.png"
rename_blob "ee.png" "EST.png"
rename_blob "eg.png" "EGY.png"
rename_blob "er.png" "ERI.png"
rename_blob "es.png" "ESP.png"
rename_blob "et.png" "ETH.png"
rename_blob "fi.png" "FIN.png"
rename_blob "fj.png" "FIJ.png"
rename_blob "fo.png" "FRO.png"
rename_blob "fr.png" "FRA.png"
rename_blob "ga.png" "GAB.png"
rename_blob "gb-eng.png" "ENG.png"
rename_blob "gb-nir.png" "NIR.png"
rename_blob "gb-sct.png" "SCO.png"
rename_blob "gb-wls.png" "WAL.png"
rename_blob "gd.png" "GRN.png"
rename_blob "ge.png" "GEO.png"
rename_blob "gh.png" "GHA.png"
rename_blob "gi.png" "GIB.png"
rename_blob "gm.png" "GAM.png"
rename_blob "gn.png" "GUI.png"
rename_blob "gq.png" "EQG.png"
rename_blob "gr.png" "GRE.png"
rename_blob "gt.png" "GUA.png"
rename_blob "gu.png" "GUM.png"
rename_blob "gw.png" "GNB.png"
rename_blob "gy.png" "GUY.png"
rename_blob "hk.png" "HKG.png"
rename_blob "hn.png" "HON.png"
rename_blob "hr.png" "CRO.png"
rename_blob "ht.png" "HAI.png"
rename_blob "hu.png" "HUN.png"
rename_blob "id.png" "IDN.png"
rename_blob "ie.png" "IRL.png"
rename_blob "il.png" "ISR.png"
rename_blob "in.png" "IND.png"
rename_blob "iq.png" "IRQ.png"
rename_blob "ir.png" "IRN.png"
rename_blob "is.png" "ISL.png"
rename_blob "it.png" "ITA.png"
rename_blob "jm.png" "JAM.png"
rename_blob "jo.png" "JOR.png"
rename_blob "jp.png" "JPN.png"
rename_blob "ke.png" "KEN.png"
rename_blob "kg.png" "KGZ.png"
rename_blob "kh.png" "CAM.png"
rename_blob "km.png" "COM.png"
rename_blob "kn.png" "SKN.png"
rename_blob "kp.png" "PRK.png"
rename_blob "kr.png" "KOR.png"
rename_blob "kw.png" "KUW.png"
rename_blob "ky.png" "CAY.png"
rename_blob "kz.png" "KAZ.png"
rename_blob "la.png" "LAO.png"
rename_blob "lb.png" "LBN.png"
rename_blob "lc.png" "LCA.png"
rename_blob "li.png" "LIE.png"
rename_blob "lk.png" "SRI.png"
rename_blob "lr.png" "LBR.png"
rename_blob "ls.png" "LES.png"
rename_blob "lt.png" "LTU.png"
rename_blob "lu.png" "LUX.png"
rename_blob "lv.png" "LVA.png"
rename_blob "ly.png" "LBY.png"
rename_blob "ma.png" "MAR.png"
rename_blob "md.png" "MDA.png"
rename_blob "me.png" "MNE.png"
rename_blob "mg.png" "MAD.png"
rename_blob "mk.png" "MKD.png"
rename_blob "ml.png" "MLI.png"
rename_blob "mm.png" "MYA.png"
rename_blob "mn.png" "MGL.png"
rename_blob "mo.png" "MAC.png"
rename_blob "mr.png" "MTN.png"
rename_blob "ms.png" "MSR.png"
rename_blob "mt.png" "MLT.png"
rename_blob "mu.png" "MRI.png"
rename_blob "mv.png" "MDV.png"
rename_blob "mw.png" "MWI.png"
rename_blob "mx.png" "MEX.png"
rename_blob "my.png" "MAS.png"
rename_blob "mz.png" "MOZ.png"
rename_blob "na.png" "NAM.png"
rename_blob "nc.png" "NCL.png"
rename_blob "ne.png" "NIG.png"
rename_blob "ng.png" "NGA.png"
rename_blob "ni.png" "NCA.png"
rename_blob "nl.png" "NED.png"
rename_blob "no.png" "NOR.png"
rename_blob "np.png" "NEP.png"
rename_blob "nz.png" "NZL.png"
rename_blob "om.png" "OMA.png"
rename_blob "pa.png" "PAN.png"
rename_blob "pe.png" "PER.png"
rename_blob "pf.png" "TAH.png"
rename_blob "pg.png" "PNG.png"
rename_blob "ph.png" "PHI.png"
rename_blob "pk.png" "PAK.png"
rename_blob "pl.png" "POL.png"
rename_blob "pr.png" "PUR.png"
rename_blob "ps.png" "PLE.png"
rename_blob "pt.png" "POR.png"
rename_blob "py.png" "PAR.png"
rename_blob "qa.png" "QAT.png"
rename_blob "ro.png" "ROU.png"
rename_blob "rs.png" "SRB.png"
rename_blob "ru.png" "RUS.png"
rename_blob "rw.png" "RWA.png"
rename_blob "sa.png" "KSA.png"
rename_blob "sb.png" "SOL.png"
rename_blob "sc.png" "SEY.png"
rename_blob "sd.png" "SDN.png"
rename_blob "se.png" "SWE.png"
rename_blob "sg.png" "SGP.png"
rename_blob "si.png" "SVN.png"
rename_blob "sk.png" "SVK.png"
rename_blob "sl.png" "SLE.png"
rename_blob "sm.png" "SMR.png"
rename_blob "sn.png" "SEN.png"
rename_blob "so.png" "SOM.png"
rename_blob "sr.png" "SUR.png"
rename_blob "ss.png" "SSD.png"
rename_blob "st.png" "STP.png"
rename_blob "sv.png" "SLV.png"
rename_blob "sy.png" "SYR.png"
rename_blob "sz.png" "SWZ.png"
rename_blob "tc.png" "TCA.png"
rename_blob "td.png" "CHA.png"
rename_blob "tg.png" "TOG.png"
rename_blob "th.png" "THA.png"
rename_blob "tj.png" "TJK.png"
rename_blob "tl.png" "TLS.png"
rename_blob "tm.png" "TKM.png"
rename_blob "tn.png" "TUN.png"
rename_blob "to.png" "TGA.png"
rename_blob "tr.png" "TUR.png"
rename_blob "tt.png" "TRI.png"
rename_blob "tw.png" "TPE.png"
rename_blob "tz.png" "TAN.png"
rename_blob "ua.png" "UKR.png"
rename_blob "ug.png" "UGA.png"
rename_blob "us.png" "USA.png"
rename_blob "uy.png" "URU.png"
rename_blob "uz.png" "UZB.png"
rename_blob "vc.png" "VIN.png"
rename_blob "ve.png" "VEN.png"
rename_blob "vg.png" "VGB.png"
rename_blob "vi.png" "VIR.png"
rename_blob "vn.png" "VIE.png"
rename_blob "vu.png" "VAN.png"
rename_blob "ws.png" "SAM.png"
rename_blob "xk.png" "KVX.png"
rename_blob "ye.png" "YEM.png"
rename_blob "za.png" "RSA.png"
rename_blob "zm.png" "ZAM.png"
rename_blob "zw.png" "ZIM.png"

# --- Deletes: no FIFA mapping ---
delete_blob "an.png"   # Netherlands Antilles (dissolved)
delete_blob "aq.png"   # Antarctica
delete_blob "ax.png"   # Åland Islands
delete_blob "bl.png"   # Saint Barthélemy
delete_blob "bq.png"   # Bonaire, Sint Eustatius and Saba
delete_blob "bv.png"   # Bouvet Island
delete_blob "cc.png"   # Cocos (Keeling) Islands
delete_blob "cx.png"   # Christmas Island
delete_blob "eh.png"   # Western Sahara
delete_blob "eu.png"   # European Union
delete_blob "fk.png"   # Falkland Islands
delete_blob "fm.png"   # Micronesia
delete_blob "gb-con.jpg" # Non-standard, not a FIFA member
delete_blob "gb.png"   # United Kingdom (not a FIFA member as UK)
delete_blob "gf.png"   # French Guiana
delete_blob "gg.png"   # Guernsey
delete_blob "gl.png"   # Greenland
delete_blob "gp.png"   # Guadeloupe
delete_blob "gs.png"   # South Georgia and South Sandwich Islands
delete_blob "hm.png"   # Heard Island and McDonald Islands
delete_blob "im.png"   # Isle of Man
delete_blob "io.png"   # British Indian Ocean Territory
delete_blob "je.png"   # Jersey
delete_blob "ki.png"   # Kiribati (not in FIFA mapping)
delete_blob "mc.png"   # Monaco
delete_blob "mf.png"   # Saint Martin
delete_blob "mh.png"   # Marshall Islands
delete_blob "mp.png"   # Northern Mariana Islands
delete_blob "mq.png"   # Martinique
delete_blob "nf.png"   # Norfolk Island
delete_blob "nr.png"   # Nauru (not in FIFA mapping)
delete_blob "nu.png"   # Niue
delete_blob "pm.png"   # Saint Pierre and Miquelon
delete_blob "pn.png"   # Pitcairn Islands
delete_blob "pw.png"   # Palau
delete_blob "re.png"   # Réunion
delete_blob "sh.png"   # Saint Helena
delete_blob "sj.png"   # Svalbard and Jan Mayen
delete_blob "sx.png"   # Sint Maarten
delete_blob "tf.png"   # French Southern Territories
delete_blob "tk.png"   # Tokelau
delete_blob "tv.png"   # Tuvalu
delete_blob "um.png"   # US Minor Outlying Islands
delete_blob "va.png"   # Vatican City
delete_blob "wf.png"   # Wallis and Futuna
delete_blob "yt.png"   # Mayotte

echo "Done."
