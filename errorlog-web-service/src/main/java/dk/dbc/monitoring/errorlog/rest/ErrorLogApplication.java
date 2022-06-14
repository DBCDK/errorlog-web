package dk.dbc.monitoring.errorlog.rest;

import dk.dbc.monitoring.errorlog.ErrorLogService;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@ApplicationPath("/api")
public class ErrorLogApplication extends Application {
    private static final Set<Class<?>> classes = new HashSet<>(Arrays.asList(ErrorLogService.class, HealthChecks.class));

    @Override
    public Set<Class<?>> getClasses() {
        return classes;
    }

}
