FROM python:3.12-slim

# Create a working directory inside the container
WORKDIR /app

# Copy dependency list into the container and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend Python files into the container
COPY . .

# Tell the container what command to run when it boots up
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]