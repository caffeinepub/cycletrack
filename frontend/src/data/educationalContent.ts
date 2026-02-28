export interface EducationTopic {
  id: string;
  title: string;
  icon: string;
  color: string;
  summary: string;
  sections: {
    heading: string;
    content: string;
  }[];
}

export const educationalTopics: EducationTopic[] = [
  {
    id: 'cycle-phases',
    title: 'Understanding Your Cycle',
    icon: '🌸',
    color: 'rose',
    summary: 'Learn about the four phases of the menstrual cycle and what happens in your body during each phase.',
    sections: [
      {
        heading: 'The Menstrual Phase (Days 1–5)',
        content: 'The menstrual phase begins on the first day of your period. During this time, the uterine lining sheds because no fertilized egg has implanted. Hormone levels (estrogen and progesterone) are at their lowest. You may experience cramping, bloating, mood changes, and fatigue. This phase typically lasts 3–7 days.',
      },
      {
        heading: 'The Follicular Phase (Days 1–13)',
        content: 'The follicular phase overlaps with menstruation and continues until ovulation. The pituitary gland releases follicle-stimulating hormone (FSH), which stimulates the ovaries to produce follicles. One dominant follicle matures and produces estrogen, which thickens the uterine lining. Energy levels typically rise during this phase.',
      },
      {
        heading: 'Ovulation (Day 14)',
        content: 'Ovulation occurs when a surge in luteinizing hormone (LH) triggers the release of a mature egg from the dominant follicle. The egg travels down the fallopian tube toward the uterus. This is the most fertile time of your cycle. Some people experience mild pelvic pain (mittelschmerz) or notice changes in cervical mucus during ovulation.',
      },
      {
        heading: 'The Luteal Phase (Days 15–28)',
        content: 'After ovulation, the empty follicle transforms into the corpus luteum, which produces progesterone. Progesterone prepares the uterine lining for a potential fertilized egg. If fertilization does not occur, the corpus luteum breaks down, progesterone drops, and menstruation begins. PMS symptoms often occur during this phase.',
      },
    ],
  },
  {
    id: 'fertility',
    title: 'Fertility & Conception',
    icon: '🌿',
    color: 'green',
    summary: 'Understand your fertile window, how conception works, and factors that influence fertility.',
    sections: [
      {
        heading: 'Your Fertile Window',
        content: 'The fertile window is the period during which pregnancy is possible. It spans about 6 days: the 5 days before ovulation and the day of ovulation itself. Sperm can survive in the female reproductive tract for up to 5 days, while an egg is only viable for 12–24 hours after release. Tracking your cycle helps identify this window.',
      },
      {
        heading: 'Signs of Ovulation',
        content: 'Common signs of ovulation include: changes in cervical mucus (becoming clear, slippery, and stretchy like egg whites), a slight rise in basal body temperature (BBT) of 0.2–0.5°C, mild pelvic pain or cramping on one side, breast tenderness, and increased libido. Ovulation predictor kits (OPKs) detect the LH surge that precedes ovulation.',
      },
      {
        heading: 'Factors Affecting Fertility',
        content: 'Many factors influence fertility, including age, overall health, stress levels, body weight, and lifestyle choices. Irregular cycles can make it harder to predict ovulation. Conditions like polycystic ovary syndrome (PCOS), endometriosis, and thyroid disorders can affect fertility. Maintaining a healthy weight, managing stress, and avoiding smoking and excessive alcohol can support reproductive health.',
      },
      {
        heading: 'Cycle Irregularities',
        content: 'A "normal" cycle ranges from 21 to 35 days. Cycles shorter than 21 days or longer than 35 days, or cycles that vary significantly month to month, are considered irregular. Irregular cycles can be caused by stress, significant weight changes, excessive exercise, hormonal imbalances, or underlying health conditions. Consult a healthcare provider if you experience persistent irregularities.',
      },
    ],
  },
  {
    id: 'safe-sex',
    title: 'Safe Sex & Contraception',
    icon: '💛',
    color: 'amber',
    summary: 'Information about contraception methods, understanding safe and unsafe periods, and sexual health.',
    sections: [
      {
        heading: 'Understanding Safe & Unsafe Periods',
        content: 'The "safe period" refers to days in your cycle when pregnancy is less likely — typically the days just before and during menstruation, and the late luteal phase. The "unsafe period" includes the days around ovulation (roughly days 10–17 in a 28-day cycle). However, cycle length varies, and relying solely on calendar-based methods is not highly reliable for contraception.',
      },
      {
        heading: 'Contraception Methods',
        content: 'Effective contraception options include: hormonal methods (birth control pills, patches, injections, implants, hormonal IUDs), barrier methods (condoms, diaphragms), long-acting reversible contraceptives (copper IUDs), and fertility awareness-based methods (FAM). Condoms are the only method that also protects against sexually transmitted infections (STIs). Consult a healthcare provider to find the best method for you.',
      },
      {
        heading: 'Fertility Awareness Methods',
        content: 'Fertility awareness-based methods (FAM) involve tracking your cycle to identify fertile and infertile days. Methods include the calendar/rhythm method, basal body temperature (BBT) charting, cervical mucus monitoring, and the symptothermal method (combining BBT and cervical mucus). When used perfectly, FAM can be 95–99% effective, but typical use effectiveness is lower. These methods require consistent tracking and do not protect against STIs.',
      },
      {
        heading: 'Sexual Health & STI Prevention',
        content: 'Regular STI testing is an important part of sexual health, especially when changing partners. Many STIs have no symptoms. Using condoms consistently and correctly reduces the risk of most STIs. Open communication with partners about sexual health history and testing is essential. Vaccines are available for HPV and hepatitis B. Regular gynecological check-ups, including Pap smears, are recommended.',
      },
    ],
  },
  {
    id: 'reproductive-health',
    title: 'Reproductive Health',
    icon: '🌺',
    color: 'purple',
    summary: 'General reproductive health information including common conditions, self-care, and when to seek medical advice.',
    sections: [
      {
        heading: 'Common Menstrual Conditions',
        content: 'Dysmenorrhea (painful periods) affects many people and can range from mild to severe. Primary dysmenorrhea is caused by prostaglandins, while secondary dysmenorrhea may indicate an underlying condition. Endometriosis occurs when tissue similar to the uterine lining grows outside the uterus, causing pain and potentially affecting fertility. PCOS is a hormonal disorder causing irregular periods, excess androgen, and polycystic ovaries.',
      },
      {
        heading: 'Managing PMS & PMDD',
        content: 'Premenstrual syndrome (PMS) affects up to 75% of people who menstruate, causing physical and emotional symptoms in the days before menstruation. Premenstrual dysphoric disorder (PMDD) is a severe form of PMS that significantly impacts daily functioning. Management strategies include regular exercise, stress reduction, adequate sleep, dietary changes (reducing caffeine, sugar, and salt), and in some cases, medication or therapy.',
      },
      {
        heading: 'Nutrition & Lifestyle',
        content: 'Diet and lifestyle significantly impact menstrual health. Iron-rich foods help replenish iron lost during menstruation. Omega-3 fatty acids may reduce inflammation and period pain. Regular moderate exercise can reduce PMS symptoms and improve mood. Adequate hydration helps reduce bloating. Limiting alcohol and caffeine, especially before your period, can reduce symptoms. Stress management through mindfulness, yoga, or therapy supports hormonal balance.',
      },
      {
        heading: 'When to See a Doctor',
        content: 'Seek medical advice if you experience: periods that are very heavy (soaking through a pad or tampon every hour), periods lasting longer than 7 days, severe pain that interferes with daily activities, periods that stop for more than 3 months (if not pregnant), spotting between periods or after sex, or significant changes in your cycle. These could indicate conditions that benefit from medical treatment.',
      },
    ],
  },
];
