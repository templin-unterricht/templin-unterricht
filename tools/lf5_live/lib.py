# Hilfen für die Inhalte: T(de,es,pt,vi,ti,ar,tr,ru) -> Liste in fester Sprachreihenfolge
LANGS=["de","es","pt","vi","ti","ar","tr","ru"]
def T(*a):
    assert len(a)==8, a
    return list(a)
