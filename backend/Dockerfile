# 1. Grab a pre-built minimal Linux image that already has Python installed
FROM python:3.12-slim

# 2. Create a working directory inside the container
WORKDIR /app

# 3. Copy our dependency list into the container and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy the rest of our backend Python files into the container
COPY . .

# 5. Tell the container what command to run when it boots up
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]