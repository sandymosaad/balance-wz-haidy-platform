export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/profile.php?id=100064718392883',
  instagram: 'https://www.instagram.com/balance_wz_haidy?igsh=c2dwanp1dDJuYzU3',
  tiktok:
    'https://www.tiktok.com/@balance_wz_haidy?_r=1&_d=e6b9ebgmil9c06&sec_uid=MS4wLjABAAAAzvG3huCU3zN_oRuSDXOKOyP_QTfcIv5e6HPk05PDVF0yFCs25-nr7ZG6AcuXuh_R&share_author_id=7504661981442950166&sharer_language=ar&source=h5_m&u_code=djm42e063537d6&timestamp=1775417577&user_id=6989982789669504005&sec_user_id=MS4wLjABAAAACka3tYfH0vUXTXTjTrl5RG600_HoX8drhVtD9cwkc3x5ba4qYARnk5Rn7AeUNuyu&item_author_type=2&utm_source=copy&utm_campaign=client_share&utm_medium=android&share_iid=7621602570440836881&share_link_id=83032189-d3a9-4bce-a101-23bac155faa3&share_app_id=1233&ugbiz_name=ACCOUNT&ug_btm=b7360%2Cb2878&social_share_type=5&enable_checksum=1',
  youtube: 'https://www.youtube.com/@balance_wz_haidy'
} as const;

export type SocialKey = keyof typeof SOCIAL_LINKS;
