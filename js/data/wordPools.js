/**
 * js/data/wordPools.js
 * Layer: DATA
 * Responsibility: Raw vocabulary data organized by CEFR level.
 * No logic here — pure static data.
 */

const WORD_POOLS = {
    A1: [
        { en: "CAT",  vn: "Con mèo",    ipa: "/kat/",    ex: "I have a cute cat." },
        { en: "DOG",  vn: "Con chó",    ipa: "/dɒɡ/",   ex: "The dog is barking." },
        { en: "BIRD", vn: "Con chim",   ipa: "/bɜːd/",  ex: "A bird is flying." },
        { en: "FISH", vn: "Con cá",     ipa: "/fɪʃ/",   ex: "Fish live in water." },
        { en: "DUCK", vn: "Con vịt",    ipa: "/dʌk/",   ex: "The duck swims in the pond." },
        { en: "COW",  vn: "Con bò",     ipa: "/kaʊ/",   ex: "The cow eats grass." },
        { en: "TREE", vn: "Cái cây",    ipa: "/triː/",  ex: "The tree is green." },
        { en: "MILK", vn: "Sữa",        ipa: "/mɪlk/",  ex: "I drink milk daily." },
        { en: "BOOK", vn: "Quyển sách", ipa: "/bʊk/",   ex: "Read a good book." },
        { en: "SUN",  vn: "Mặt trời",   ipa: "/sʌn/",   ex: "The sun is hot." }
    ],
    A2: [
        { en: "APPLE", vn: "Quả táo",  ipa: "/ˈap(ə)l/", ex: "An apple a day." },
        { en: "BREAD", vn: "Bánh mì",  ipa: "/brɛd/",    ex: "I eat bread for breakfast." },
        { en: "WATER", vn: "Nước",     ipa: "/ˈwɔːtə/",  ex: "Drink plenty of water." },
        { en: "HOUSE", vn: "Ngôi nhà", ipa: "/haʊs/",    ex: "My house is big." },
        { en: "TRAIN", vn: "Tàu hỏa",  ipa: "/treɪn/",   ex: "The train is fast." },
        { en: "CLOCK", vn: "Đồng hồ",  ipa: "/klɒk/",    ex: "Look at the clock." },
        { en: "HEART", vn: "Trái tim", ipa: "/hɑːt/",    ex: "Listen to your heart." },
        { en: "SMILE", vn: "Nụ cười",  ipa: "/smʌɪl/",   ex: "She has a nice smile." }
    ],
    B1: [
        { en: "SCHOOL", vn: "Trường học",  ipa: "/skuːl/",       ex: "Children go to school." },
        { en: "OFFICE", vn: "Văn phòng",   ipa: "/ˈɒfɪs/",       ex: "He works in an office." },
        { en: "PLANET", vn: "Hành tinh",   ipa: "/ˈplanɪt/",     ex: "Earth is a planet." },
        { en: "FOREST", vn: "Khu rừng",    ipa: "/ˈfɒrɪst/",     ex: "Wild animals in the forest." },
        { en: "CASTLE", vn: "Lâu đài",     ipa: "/ˈkɑːs(ə)l/",  ex: "The king lives in a castle." },
        { en: "DRAGON", vn: "Con rồng",    ipa: "/ˈdraɡ(ə)n/",  ex: "A mythical flying dragon." },
        { en: "ISLAND", vn: "Hòn đảo",    ipa: "/ˈʌɪlənd/",     ex: "We went to a tropical island." },
        { en: "GUITAR", vn: "Đàn ghi-ta",  ipa: "/ɡɪˈtɑː/",     ex: "He plays the acoustic guitar." }
    ],
    B2: [
        { en: "SCIENCE", vn: "Khoa học",   ipa: "/ˈsʌɪəns/",    ex: "Science explains nature." },
        { en: "ENERGY",  vn: "Năng lượng", ipa: "/ˈɛnədʒi/",    ex: "Solar energy is clean." },
        { en: "THEORY",  vn: "Lý thuyết",  ipa: "/ˈθɪəri/",     ex: "In theory, it works." },
        { en: "COMPLEX", vn: "Phức tạp",   ipa: "/ˈkɒmplɛks/",  ex: "A complex mathematical problem." },
        { en: "BALANCE", vn: "Cân bằng",   ipa: "/ˈbal(ə)ns/",  ex: "Keep your work-life balance." },
        { en: "MYSTERY", vn: "Bí ẩn",      ipa: "/ˈmɪst(ə)ri/", ex: "An unsolved murder mystery." },
        { en: "GALAXY",  vn: "Thiên hà",   ipa: "/ˈɡaləksi/",   ex: "The Milky Way galaxy." },
        { en: "JOURNEY", vn: "Hành trình", ipa: "/ˈdʒəːni/",    ex: "Life is a beautiful journey." }
    ],
    C1: [
        { en: "PARADIGM",  vn: "Mô hình, Hệ chuẩn", ipa: "/ˈparədʌɪm/", ex: "A new paradigm in business." },
        { en: "AESTHETIC", vn: "Thẩm mỹ",           ipa: "/iːsˈθɛtɪk/", ex: "The building has aesthetic appeal." },
        { en: "METAPHOR",  vn: "Ẩn dụ",             ipa: "/ˈmɛtəfə/",   ex: "Poetry is full of metaphors." },
        { en: "PRAGMATIC", vn: "Thực dụng",          ipa: "/praɡˈmatɪk/",ex: "A pragmatic approach to the problem." },
        { en: "ELOQUENT",  vn: "Hùng hồn",           ipa: "/ˈɛləkwənt/", ex: "An eloquent speech by the president." }
    ],
    C2: [
        { en: "UBIQUITOUS",  vn: "Có mặt khắp nơi",      ipa: "/juːˈbɪkwɪtəs/",   ex: "Smartphones are ubiquitous today." },
        { en: "EPHEMERAL",   vn: "Phù du, Chóng vánh",   ipa: "/ɪˈfɛm(ə)rəl/",    ex: "Fame is often ephemeral." },
        { en: "SERENDIPITY", vn: "Sự tình cờ may mắn",   ipa: "/ˌsɛr(ə)nˈdɪpɪti/",ex: "Meeting her was pure serendipity." },
        { en: "MELANCHOLY",  vn: "U sầu, Sầu muộn",      ipa: "/ˈmɛlənkəli/",      ex: "A feeling of profound melancholy." },
        { en: "QUINTESSENCE",vn: "Tinh hoa, Tinh túy",   ipa: "/kwɪnˈtɛs(ə)ns/",  ex: "He is the quintessence of professionalism." }
    ]
};

/** Challenge mode uses a hardcoded word set */
const CHALLENGE_LEVEL = {
    id: 99, title: "Challenge Mode", size: 10, mode: 'challenge', timer: 60,
    words: [
        { en: "GALAXY",  vn: "Thiên hà" }, { en: "METEOR",  vn: "Sao băng" },
        { en: "ORBIT",   vn: "Quỹ đạo" },  { en: "ROCKET",  vn: "Tên lửa" },
        { en: "GRAVITY", vn: "Trọng lực" }, { en: "STAR",    vn: "Ngôi sao" },
        { en: "MOON",    vn: "Mặt trăng" }, { en: "SUN",     vn: "Mặt trời" }
    ]
};