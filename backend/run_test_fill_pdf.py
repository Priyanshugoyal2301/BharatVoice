from utils.pdf_generator import fill_pdf_form

if __name__ == '__main__':
    data = {
        "answers": {"1": {"question": "Name", "answer": "Test User"}},
        "documents": {},
        "user_profile": {"name": "Test User", "email": "test@example.com"}
    }
    try:
        path = fill_pdf_form(data)
        print('PDF generated at:', path)
    except Exception as e:
        import traceback
        traceback.print_exc()
        print('ERROR:', e)
