# ============================
# Stage 1: Build Backend JAR
# ============================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy only backend for faster caching
COPY stock_master_backend ./stock_master_backend

# Move inside backend folder where pom.xml exists
WORKDIR /app/stock_master_backend

RUN mvn clean package -DskipTests


# ============================
# Stage 2: Run Application
# ============================
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

# Copy built JAR from the build stage
COPY --from=build /app/stock_master_backend/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
