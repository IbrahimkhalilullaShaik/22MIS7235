"use client";

import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
  CircularProgress,
  AppBar,
  Toolbar,
  Paper,
  Avatar,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import WorkIcon from "@mui/icons-material/Work";
import EventIcon from "@mui/icons-material/Event";
import SchoolIcon from "@mui/icons-material/School";

interface Notification {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
}

export default function Home() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://4.224.186.213/evaluation-service/notifications")
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data.notifications || []);
        setLoading(false);
      })
      .catch(() => {
        setNotifications([
          {
            ID: "1",
            Type: "Placement",
            Message: "Microsoft hiring drive starts tomorrow.",
            Timestamp: "2026-05-16 18:00",
          },
          {
            ID: "2",
            Type: "Result",
            Message: "Mid-semester results are published.",
            Timestamp: "2026-05-16 17:00",
          },
          {
            ID: "3",
            Type: "Event",
            Message: "Annual Tech Fest registrations are open.",
            Timestamp: "2026-05-16 16:00",
          },
          {
            ID: "4",
            Type: "Placement",
            Message: "Amazon shortlisted candidates announced.",
            Timestamp: "2026-05-16 15:30",
          },
        ]);

        setLoading(false);
      });
  }, []);

  const getColor = (type: string) => {
    if (type === "Placement") return "success";
    if (type === "Result") return "primary";
    return "warning";
  };

  const getIcon = (type: string) => {
    if (type === "Placement") return <WorkIcon />;
    if (type === "Result") return <SchoolIcon />;
    return <EventIcon />;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(to right,rgb(10, 10, 10),rgb(24, 24, 24))",
        pb: 5,
      }}
    >
      <AppBar
        position="static"
        sx={{
          background: "#111",
          borderBottom: "1px solid #333",
        }}
      >
        <Toolbar>
          <NotificationsIcon sx={{ mr: 2 }} />
          <Typography variant="h6">
            AffordMed Notification System
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            background: "#1c1c1c",
            color: "white",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Notification Dashboard
          </Typography>

          <Typography sx={{ mt: 1, color: "#bbb" }}>
            Real-time academic, event and placement notifications
          </Typography>
        </Paper>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            mt={10}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {notifications.map((notification) => (
              <Grid item xs={12} md={6} lg={4} key={notification.ID}>
                <Card
                  sx={{
                    borderRadius: 4,
                    background: "#1e1e1e",
                    color: "white",
                    transition: "0.3s",
                    border: "1px solid #2d2d2d",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow:
                        "0 8px 25px rgba(0,0,0,0.4)",
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Avatar
                        sx={{
                          bgcolor:
                            notification.Type === "Placement"
                              ? "green"
                              : notification.Type === "Result"
                              ? "blue"
                              : "orange",
                        }}
                      >
                        {getIcon(notification.Type)}
                      </Avatar>

                      <Chip
                        label={notification.Type}
                        color={getColor(notification.Type)}
                      />
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{ mt: 3 }}
                    >
                      {notification.Message}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        mt: 3,
                        color: "#aaa",
                      }}
                    >
                      {notification.Timestamp}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}