import json
import re
from pathlib import Path
import pronouncing

ARPABET_TO_IPA = {
    'AA': 'ɑ', 'AE': 'æ', 'AH': 'ʌ', 'AO': 'ɔ', 'AW': 'aʊ', 'AX': 'ə', 'AY': 'aɪ',
    'B': 'b', 'CH': 'tʃ', 'D': 'd', 'DH': 'ð', 'EH': 'ɛ', 'ER': 'ɜː', 'EY': 'eɪ',
    'F': 'f', 'G': 'ɡ', 'HH': 'h', 'IH': 'ɪ', 'IY': 'iː', 'JH': 'dʒ', 'K': 'k',
    'L': 'l', 'M': 'm', 'N': 'n', 'NG': 'ŋ', 'OW': 'oʊ', 'OY': 'ɔɪ', 'P': 'p',
    'R': 'r', 'S': 's', 'SH': 'ʃ', 'T': 't', 'TH': 'θ', 'UH': 'ʊ', 'UW': 'uː',
    'V': 'v', 'W': 'w', 'Y': 'j', 'Z': 'z', 'ZH': 'ʒ'
}

VOWEL_STRESS_MARKS = {
    '0': '̆',  # optional breve if you want to mark unstressed
    '1': 'ˈ',
    '2': 'ˌ'
}


def arpabet_to_ipa(arpabet_tokens):
    parts = []
    for tok in arpabet_tokens:
        stress = ''
        if tok[-1].isdigit():
            base, digit = tok[:-1], tok[-1]
            stress = VOWEL_STRESS_MARKS.get(digit, '')
        else:
            base = tok
        ipa = ARPABET_TO_IPA.get(base)
        if ipa is None:
            # preserve unknown token as is
            ipa = tok.lower()
        if stress and base in ARPABET_TO_IPA:
            # place stress marker before vowel
            ipa = stress + ipa
        parts.append(ipa)
    return ''.join(parts)


def normalize_word(word):
    return word.strip().lower()


MANUAL_IPA_FALLBACK = {
    'analyse': 'ˈænəlaɪz',
    'analyze': 'ˈænəlaɪz',
    'unready': 'ʌn ˈrɛdi',
}


def generate_ipa(word):
    # pronouncing expects lowercase, no punctuation
    clean = word.lower().replace("'", "").replace('.', '')
    if clean in MANUAL_IPA_FALLBACK:
        return MANUAL_IPA_FALLBACK[clean]

    phones = pronouncing.phones_for_word(clean)
    if phones:
        # choose the first pronunciation
        arpabet = phones[0].split()
        return arpabet_to_ipa(arpabet)

    # fallback for multi-word phrases or underscore-separated tokens
    tokens = re.split(r'[\s_-]+', clean)
    if len(tokens) > 1:
        parts = []
        for token in tokens:
            if not token:
                continue
            token_phones = pronouncing.phones_for_word(token)
            if not token_phones:
                parts = []
                break
            parts.append(arpabet_to_ipa(token_phones[0].split()))
        if parts:
            return ' '.join(parts)

    # fallback for simple un- prefix words not in CMUdict
    if clean.startswith('un') and len(clean) > 2:
        remainder = clean[2:]
        remainder_phones = pronouncing.phones_for_word(remainder)
        if remainder_phones:
            return 'ʌn ' + arpabet_to_ipa(remainder_phones[0].split())

    return ''


def repair_and_load_json(source_path, fixed_path):
    raw_text = source_path.read_text(encoding='utf-8')
    try:
        return json.loads(raw_text)
    except json.JSONDecodeError as ex:
        print(f'Original JSON parse failed: {ex}')

    lines = raw_text.splitlines()
    repaired_lines = []
    for idx, line in enumerate(lines):
        stripped = line.strip()
        if stripped in ('{', '}') and idx not in (0, len(lines) - 1):
            continue
        repaired_lines.append(line)

    if len(repaired_lines) >= 2 and repaired_lines[-1].strip() == '}':
        for idx in range(len(repaired_lines) - 2, -1, -1):
            last_prop = repaired_lines[idx]
            stripped_last = last_prop.strip()
            if not stripped_last:
                continue
            if stripped_last.startswith('"') and not (stripped_last.endswith('"') or stripped_last.endswith('\",')):
                repaired_lines[idx] = last_prop.rstrip() + '"'
            break

    repaired_text = '\n'.join(repaired_lines) + '\n'
    try:
        data = json.loads(repaired_text)
        fixed_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
        print(f'Repaired JSON written to {fixed_path}')
        return data
    except json.JSONDecodeError as ex:
        print(f'Repaired JSON still invalid: {ex}')

    pattern = re.compile(r'"((?:[^"\\]|\\.)*)"\s*:\s*"((?:[^"\\]|\\.)*)"')
    pairs = pattern.findall(raw_text)
    data = {}
    for k, v in pairs:
        data[k] = v
    dup_count = len(pairs) - len(data)
    print(f'Recovered {len(data)} entries from malformed JSON using regex fallback')
    if dup_count:
        print(f'Ignored {dup_count} duplicate keys, using last occurrence for each key')
    fixed_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Recovered JSON written to {fixed_path}')
    return data


def main():
    workspace_root = Path(__file__).resolve().parents[1]
    local_source = workspace_root / 'js' / 'data' / 'tu_vung_hoan_thien.json'
    fixed_path = workspace_root / 'js' / 'data' / 'tu_vung_hoan_thien_fixed.json'
    dest_path = workspace_root / 'js' / 'data' / 'tu_vung_hoan_thien_with_ipa.json'

    if local_source.exists():
        try:
            data = json.loads(local_source.read_text(encoding='utf-8'))
        except json.JSONDecodeError:
            print(f'Local source JSON malformed, repairing: {local_source}')
            data = repair_and_load_json(local_source, fixed_path)
            local_source.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    elif fixed_path.exists():
        print(f'Official JSON missing, copying repaired source to: {local_source}')
        local_source.write_text(fixed_path.read_text(encoding='utf-8'), encoding='utf-8')
        data = json.loads(local_source.read_text(encoding='utf-8'))
    else:
        raise FileNotFoundError(f'Neither official nor repaired source found: {local_source} or {fixed_path}')

    output = []
    missing = []

    for en, vn in data.items():
        ipa = generate_ipa(en)
        if not ipa:
            missing.append(en)
        output.append({
            'en': en,
            'vn': vn,
            'ipa': ipa,
        })

    dest_path.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Wrote {len(output)} entries to {dest_path}')
    print(f'Missing IPA for {len(missing)} words')
    if missing:
        print('Sample missing:', missing[:50])


if __name__ == '__main__':
    main()
